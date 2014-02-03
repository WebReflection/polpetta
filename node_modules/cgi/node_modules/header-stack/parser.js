require('bufferjs');
var Stream = require('stream').Stream;
var EventEmitter = require('events').EventEmitter;
var StreamStack = require('stream-stack').StreamStack;
var BufferList = require('bufferlist');
var Headers = require('./headers');

function Parser(stream, opts) {
  if (!(stream instanceof Stream)) {
    opts = stream;
    stream = new Stream();
  }
  opts = opts || {};
  opts.__proto__ = Parser.DEFAULTS;
  this.stream = stream;
  this.options = opts;
  this._buffers = new BufferList();
  this.headers = new Headers();
  this._firstLineFired = false;
  this._headersFired = false;

  // We use an internal StreamStack instance, so that the
  // end-user doesn't think that the Parser instance can
  // be `pipe()`ed from.
  var self = this;
  this._parser = new StreamStack(stream, {
    data: function onData(chunk) {
      self._onData(chunk);
    },
    end: function onEnd() {
      self._onEnd();
    }
  });
}
require('util').inherits(Parser, EventEmitter);
module.exports = Parser;

// The default 'options' for the Parser, can be overwritten during construction
Parser.DEFAULTS = {
  emitFirstLine: false,
  strictCRLF: false,
  strictSpaceAfterColon: false,
  allowFoldedHeaders: false
};

Parser.LF = new Buffer('\n');
Parser.CRLF = new Buffer('\r\n');


// You may manually call the 'parse' function if no ReadableStream
// was passed into the constructor.
Parser.prototype.parse = function parse(b) {
  return this.stream.emit('data', b);
}

// Parsing Logic:
//   - Check if _buffers contains an end-of-line delimiter:
//      - If yes, slice up to the first end-of-line found:
//         - If slice.length === 0, then an empty line was found. Fire the 'headers' event
//         - else if the slice begins with whitespace:
//            - If 'allowFoldedHeaders' is true, then append to the previous header
//            - else if 'allowFoldedHeaders' is false then emit a ParserError.
//         - Else parse the line into the headers array. If _buffers.length > 0, call _onData again
//      - If no, do nothing, wait for next 'data' event
Parser.prototype._onData = function onData(chunk) {
  if (chunk) {
    if (!Buffer.isBuffer(chunk)) chunk = new Buffer(chunk);
    this._buffers.push(chunk);
  }
  var buf = this._buffers.take();
  var eol = buf.indexOf(Parser.CRLF);
  var delimLength = Parser.CRLF.length;
  if (eol === -1) {
    eol = buf.indexOf(Parser.LF);
    delimLength = Parser.LF.length;
    if (eol !== -1 && this.options.strictCRLF) {
      return this.emit('error', new Error('ParseError: Found a lone \'\\n\' char, and `strictCRLF` is true'));
    }
  }
  if (eol !== -1) {
    var slice = buf.slice(0, eol);
    this._buffers.advance(eol+delimLength);
    this._parseHeaderLine(slice.toString());
    if (this._buffers.length > 0) {
      this._onData();
    }
  } else {
    //console.error("waiting for the next 'data' event");
  }
}

// If we get the 'end' event before the 'headers' event was fired, then
// something went wrong with the upstream, and we should emit a parsing error.
Parser.prototype._onEnd = function onEnd() {
  if (!this._headersFired) {
    return this.emit('error', new Error('ParseError: Got "end" event before the end of headers was found'));
  }
}

// Parses a single line into a key-value header pair, and adds the
// pair to the 'headers' Array. 'line' is a String.
Parser.prototype._parseHeaderLine = function parseHeaderLine(line) {
  //console.error("Got header line:");
  //console.error(line);
  if (!this._firstLineFired && this.options.emitFirstLine) {
    this._firstLineFired = true;
    this.emit('firstLine', line);
  } else if (line.length === 0) {
    // An empty line is the end of the headers
    this._onHeadersComplete();
  } else if (line[0] === ' ' || line[0] === '\t') {
    // A line beginning with whitespace is a folded header
    if (!this.options.allowFoldedHeaders) {
      return this.emit('error', new Error('ParseError: Encountered a folded header, but `allowFoldedHeaders` is false'));
    }
    var prevIndex = this.headers.length - 1;
    var prevHeader = this.headers[prevIndex];
    line = line.trimLeft();
    this.headers._addHeader(prevHeader + ' ' + line, prevHeader.key, prevHeader.value + ' ' + line, prevIndex);
  } else {
    // A regular header line, parse like normal
    var firstColon = line.indexOf(':');
    if (firstColon < 1) {
      return this.emit('error', new Error('ParseError: Malformed header line, no delimiter (:) found: "' + line + '"'));
    }
    var spaceAfterColon = line[firstColon+1] === ' ';
    if (!spaceAfterColon && this.options.strictSpaceAfterColon) {
      return this.emit('error', new Error('ParseError: Encountered a header line without a space after the colon, and `strictSpaceAfterColon` is true'));
    }
    var key = line.substring(0, firstColon);
    var value = line.substring(firstColon + (spaceAfterColon ? 2 : 1));
    this.headers._addHeader(line, key, value, this.headers.length);
  }
}


Parser.prototype._onHeadersComplete = function onHeadersComplete() {
  this._headersFired = true;
  var leftover;
  if (this._buffers.length > 0) {
    leftover = this._buffers.take();
    this._buffers.advance(leftover.length);
  }
  this._parser.cleanup();
  this.emit('headers', this.headers, leftover);
}
