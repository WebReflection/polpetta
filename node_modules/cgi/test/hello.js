http = require('http');
cgi  = require('../cgi');

var server = http.createServer(
  cgi(__dirname + '/cgi-bin/hello.cgi')
);
server.listen(5555, function() {
  console.log('server listening');

  var client = http.createClient(5555, '127.0.0.1');
  var req = client.request('GET', '/?test=1');
  req.on('response', function (res) {
    console.log(res.headers);
  });
  req.end();
});
