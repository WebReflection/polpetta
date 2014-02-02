var inspect = require('util').inspect;


// The 'new' operator is *not* required to create a proper 'Headers' instance.
function Headers(initial) {
  var rtn = new Array();
  rtn.__proto__ = Headers.prototype;
  if (initial) {
    if (Array.isArray(initial)) {
      // An Array was passed in, add each item as headers.
      initial.forEach(function(header) {
        if (Array.isArray(header)) {
          rtn.addHeader(header[0], header[1]);
        } else if (header.key && header.value) {
          rtn.addHeader(header.key, header.value);
        } else if (typeof header == 'string' && ~header.indexOf(':')) {
          var firstColon = header.indexOf(':')
            , valIndex = firstColon + 1
          if (header[valIndex] === ' ') valIndex++;
          rtn.addHeader(header.substring(0, firstColon), header.substring(valIndex));
        } else {
          throw new Error("Don't know what to do with this header: '"  + header + "'");
        }
      });
    } else {
      // A regular Object was passed, add each key and value as headers.
      for (var key in initial) {
        rtn.addHeader(key, initial[key]);
      }
    }
  }
  return rtn;
}
module.exports = Headers;

Headers.prototype.__proto__ = Array.prototype;

// Users should use the 'addHeader' function if they would like to
// add another header to the end of the headers.
Headers.prototype.addHeader = function addHeader(key, value) {
  this._addHeader(key + ': ' + value, key, value, this.length);
}

Headers.prototype._addHeader = function _addHeader(line, key, value, index) {
  line = new String(line);
  line.key = key;
  line.value = value;
  this[index] = line;
  this[key] = this[key.toLowerCase()] = value;
}

// A custom 'inspect' function for util.inspect to use on these mutant
// header Arrays. Otherwise they're extremely ugly to `console.log`.
Headers.prototype.inspect = function headerInspect() {
  var len = this.length;
  if (len == 0) return '[]';
  var str = '';
  this.forEach(function(header, i) {
    str += (i == 0 ? '[ ' : '  ') +
           inspect(header.key) + ': ' +
           inspect(header.value) +
           (i != len-1 ? ',\n' : ' ]');
  });
  return str;
}

// These are the default 'toString' options of the 'Headers' class,
// if that particular property is not overriden.
Headers.STRING_DEFAULTS = {
  // For SMTP, if a header is longer than 'maxLineLength', then do "folding"
  // TODO: Implement this in the 'toString' function
  maxLineLength: Infinity,
  // If set to a String, then it will be used as the first line of the output string.
  firstLine: false,
  // The delimiter to join the headers with
  delimiter: "\r\n",
  // If 'true', then add an additional 'delimiter' to the end of the String
  // indicating the end of the headers. If 'false', then that won't be added.
  emptyLastLine: true
}

// The 'toString' is used in when writing out headers
Headers.prototype.toString = function toString(options) {
  options = options || {};
  options.__proto__ = Headers.STRING_DEFAULTS;
  return (options.firstLine ? options.firstLine + options.delimiter : '') + 
    this.join(options.delimiter) + options.delimiter +
    (options.emptyLastLine ? options.delimiter : '');
}
