
// function used to perform very first connection
function serverListen() {
  server.listen(port, HOST_NAME, serverListen.connect);
}

serverListen.connected = false;

serverListen.connect = function () {
  if (!serverListen.connected) {
    serverListen.connected = true;
    var address = server.address();
    console.log("http://" + address.address + ":" + address.port + "/");
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
  ++port;
  process.nextTick(serverListen);
};
