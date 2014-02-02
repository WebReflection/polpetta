var assert = require('assert');
var Stream = require('stream').Stream;
var Parser = require('../parser');

var body = new Buffer('\r\n');
var stream = new Stream();

var parser = new Parser(stream, {
  strictCRLF: true
});
parser.on('headers', function(headers, leftover) {
  assert.equal(headers.length, 0);
  assert.ok(!leftover);
});

stream.emit('data', body);
stream.emit('end');
