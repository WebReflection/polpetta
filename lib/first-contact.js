var
  constitution = require('./constitution.js'),
  guardian = require('./guardian.js'),
  http = require('http'),
  port = constitution.PORT,
  waitingForConnection = true;

function genericError() {
  if (!constitution.PORT_FROM_PEOPLE.length) {
    console.log([
      "=======================================================",
      "Unable to use specified port: ",
      port,
      "-------------------------------------------------------",
      "Try to kill previous process or",
      "try again without the port to find one available",
      "======================================================="
    ].join("\n"));
    return true;
  } else {
    ++port;
    serverListen();
  }
}

this.connect = function connect(onconnect, onerror) {
  function connect() {
    var address;
    if (waitingForConnection) {
      waitingForConnection = false;
      address = server.address();
      console.log([
        'http:', '', address.address + ":" + address.port, ''
      ].join(guardian.sep));
      console.log([
        "#",
        "(^.^)",
        "polpetta",
        guardian.root
      ].join(" "));
    }
    server.on('close', function close() {
      server.removeListener('close', close);
      onconnect(address.address, address.port);
    });
    server.close();
  }
  function serverListen() {
    server.listen(port, constitution.HOST_NAME || constitution.IP, connect);
  }
  var server = http.createServer(function(){}).on('error', function () {
    if (genericError() && onerror) {
      onerror();
    }
  });
  serverListen();
};