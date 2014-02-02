var fs = require('fs');
var assert = require('assert');
var Parser = require('../parser');

var stream = fs.createReadStream(__dirname + '/dumps/simple-curl-get.dump');
var parser = new Parser(stream, {
  emitFirstLine: true,
  strictCRLF: true
});
var gotFirstLine = false;
parser.on('firstLine', function (line) {
  gotFirstLine = true;
  assert.equal(line, 'GET / HTTP/1.1');
});
var gotHeaders = false;
parser.on('headers', function (headers, leftover) {
  gotHeaders = true;
  assert.equal(headers.length, 3);
  assert.equal(headers['User-Agent'], 'curl/7.21.0 (i686-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.18');
  assert.equal(headers.host, 'localhost:8080');
  assert.equal(headers[2], 'Accept: */*')
  assert.equal(headers[2].key, 'Accept');
  assert.equal(headers[2].value, '*/*')
  assert.ok(!leftover);
});

process.on('exit', function () {
  assert.ok(gotFirstLine);
  assert.ok(gotHeaders);
});
