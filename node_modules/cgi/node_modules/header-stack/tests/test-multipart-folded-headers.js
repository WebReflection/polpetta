var fs = require('fs');
var assert = require('assert');
var Parser = require('../parser');

var stream = fs.createReadStream(__dirname + '/dumps/multipart-folded-headers.eml', {
  //bufferSize: 1
});
var parser = new Parser(stream, {
  strictCRLF: true,
  allowFoldedHeaders: true
});
var gotHeaders = false;
parser.on('headers', function (headers, leftover) {
  gotHeaders = true;
  assert.equal(headers[0].value, 'from cm-omr2 (mail.networksolutionsemail.com [205.178.146.50]) by omr2.networksolutionsemail.com (8.13.6/8.13.6) with ESMTP id p2MHKqUI024119 for <ilon@viewdar.com>; Tue, 22 Mar 2011 13:20:52 -0400');
});
process.on('exit', function() {
  assert.ok(gotHeaders);
});
