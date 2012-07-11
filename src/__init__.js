
// need some help ?
if (/^--?h(?:elp)?$/i.test(arguments[0])) {
  help();
}
// need some folder ?
else {
  fs.stat(polpetta.root, function (err, stats) {
    if (err || !stats.isDirectory()) {
      console.log([
        "=======================================================",
        "Unable to use this folder as root:",
        polpetta.root,
        "-------------------------------------------------------",
        "Try node polpetta --help to know hot to start",
        "Or be sure the provided folder exists",
        "======================================================="
      ].join("\n"));
    } else {
      // require(path.join(p.root, "test.njs"));
      serverListen(server.on("error", serverListen.error));
    }
  });

}