var assert = require('assert');
var Stream = require('stream').Stream;
var Parser = require('../parser');

// No args will use a new internal Stream,
// call 'parse(buffer)' manually.
var p1 = new Parser();
assert.ok(p1.stream instanceof Stream);
for (var i in p1.options) assert.strictEqual(p1.options[i], Parser.DEFAULTS[i]);


// Omitting a Stream, but defining an Options argument
// should still be allowed.
var p2 = new Parser({
  emitFirstLine: true
});
assert.ok(p2.stream instanceof Stream);
assert.notStrictEqual(p1.stream, p2.stream);
assert.strictEqual(true, p2.options.emitFirstLine);


// And including both a Stream instance will use the passed in ReadableStream.
var s = new Stream();
var p3 = new Parser(s);
assert.strictEqual(s, p3.stream);
