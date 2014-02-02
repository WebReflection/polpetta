var http = require('http');
var cgi  = require('../cgi');
var assert = require('assert');

var server = http.createServer(
  cgi(__dirname + '/cgi-bin/node.cgi')
);
server.listen(5555, function() {
  console.log('server listening on port:', server.address().port);

  var client = http.createClient(5555, '127.0.0.1');
  var req = client.request('GET', '/');
  req.on('response', function (res) {
    console.log(res.statusCode);
    assert.equal(res.statusCode, 201);
    console.log(res.headers);
    res.on('data', function(b) {
      console.log("got 'data':", b);
    });
    res.on('end', function() {
      console.log("got 'end'");
      server.close();
    });
  });
  req.end();
});
