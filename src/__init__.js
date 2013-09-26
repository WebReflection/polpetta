
// only if loaded as stand alone
if (!module.parent) {
  // need some help ?
  if (/^--?h(?:elp)?$/i.test(arguments[0])) {
    help();
  }
  // need some folder ?
  else {
    fs.stat(root, function (err, stats) {
      if (err || !stats.isDirectory()) {
        console.log([
          "=======================================================",
          "Unable to use this folder as root:",
          root,
          "-------------------------------------------------------",
          "Try node polpetta --help to know how to start",
          "Or be sure the provided folder exists",
          "======================================================="
        ].join("\n"));
      } else {
          if(SSL){
              server = https.createServer({
                  cert : Polpetta.prototype.cert,
                  ca : Polpetta.prototype.ca,
                  key: Polpetta.prototype.key
              }, Polpetta.factory);
              serverListen(server.on("error", serverListen.error));
          }else{
              server = http.createServer(Polpetta.factory);
              serverListen(server.on("error", serverListen.error));
          }


      }
    });

  }
}