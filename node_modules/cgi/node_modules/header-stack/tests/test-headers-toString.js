var assert = require('assert');
var Headers = require('../headers');
var Parser = require('../parser');


var h = Headers({
  'Content-Type': 'text/plain',
  'Content-Length': 7
});


var normal = h.toString();
assert.equal(normal.split('\r\n').length, 4);
assert.equal(normal.indexOf('\r\n\r\n'), normal.length-4);


var noLastLine = h.toString({
  emptyLastLine: false
});
assert.equal(noLastLine.split('\r\n').length, 3);
assert.equal(noLastLine.indexOf('\r\n\r\n'), -1);


var firstLine = h.toString({
  firstLine: 'test'
});
assert.equal(firstLine.indexOf('test'), 0);


var delimiter = h.toString({
  delimiter: '~~'
});
assert.equal(delimiter.split('~~').length, 4);


var parser = new Parser();
var gotHeaders = false;
parser.on('headers', function(headers, leftover) {
  gotHeaders = true;
  assert.equal(headers.length, 2);
});
parser.parse(new Buffer(h.toString({})));


process.on('exit', function() {
  assert.ok(gotHeaders);
});
