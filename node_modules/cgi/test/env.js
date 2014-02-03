var http = require('http');
var cgi  = require('../cgi');
var stack = require('stack');

var PORT = 5555;
var server = http.createServer(
  stack(
    require('creationix/log')(),
    cgi(__dirname + '/cgi-bin/printenv.cgi')
  )
);
server.listen(PORT, function() {
  console.log('server listening');

  var client = http.createClient(PORT);
  var req = client.request('GET', '/?test=1');
  req.on('response', function (res) {
    console.log(res.headers);
    res.pipe(process.stdout, {end:false});
    res.on('end', client.end.bind(client));
  });
  req.end();
});
