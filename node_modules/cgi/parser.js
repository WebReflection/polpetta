var Stream = require('stream').Stream;
var StreamStack = require('stream-stack').StreamStack;
var HeaderParser = require('header-stack').Parser;

/**
 * Parses CGI headers (\n newlines) until a blank line,
 * signifying the end of the headers. After the blank line
 * is assumed to be the body, which you can use 'pipe()' with.
 */
function Parser(stream) {
  StreamStack.call(this, stream, {
    data: function(b) { this._onData(b); }
  });
  this._onData = this._parseHeader;
  this._headerParser = new HeaderParser(new Stream(), {
    emitFirstLine: false,
    strictCRLF: false,
    strictSpaceAfterColon: false,
    allowFoldedHeaders: false
  });
  this._headerParser.on('headers', this._onHeadersComplete.bind(this));
}
require('util').inherits(Parser, StreamStack);
module.exports = Parser;

Parser.prototype._proxyData = function(b) {
  this.emit('data', b);
}

Parser.prototype._parseHeader = function(chunk) {
  this._headerParser.stream.emit('data', chunk);
}

Parser.prototype._onHeadersComplete = function(headers, leftover) {
  this._onData = this._proxyData;
  this.emit('headers', headers);
  if (leftover) {
    this._onData(leftover);
  }
}
