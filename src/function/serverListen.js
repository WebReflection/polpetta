
// function used to perform very first connection
function serverListen() {
  server.listen(port, HOST_NAME, serverListen.connect);
}

serverListen.connected = false;

serverListen.connect = function () {
  if (!serverListen.connected) {
    serverListen.connected = true;
    var address = server.address();
    console.log("http:" + WEB_SEP + WEB_SEP + address.address + ":" + address.port + WEB_SEP);
    console.log([
      "#",
      "(က)",
      "polpetta",
      "v" + polpetta.version,
      polpetta.root
    ].join(" "));
  }
};

serverListen.error = function () {
  if (HOST_USER_PORT) {
    console.log([
      "=======================================================",
      "Unable to use specified port: ",
      port,
      "-------------------------------------------------------",
      "Try to kill previous process or",
      "try again without the port to find one available",
      "======================================================="
    ].join("\n"));
  } else {
    ++port;
    process.nextTick(serverListen);
  }
};
