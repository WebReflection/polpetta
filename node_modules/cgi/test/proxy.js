var fs = require('fs');
var http = require('http');
var https = require('https');
var cgi = require('cgi');

// The HTTPS SSL options
var options = {
  key: fs.readFileSync(__dirname + '/ssl.key'),
  cert: fs.readFileSync(__dirname + '/ssl.crt')
}

var handler = cgi(__dirname + '/cgi-bin/nph-proxy.cgi', {
  nph: true,
  env: {
    //RUNNING_ON_SSL_SERVER: 1
  }
});

http.createServer(handler).listen(80);
https.createServer(options, handler).listen(443);
