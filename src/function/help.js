
// if you do something wrong ...
// or you simply need help
function help() {
  console.log([
    "=======================================================",
    "      (က) Polpetta, any folder is served spiced",
    "=======================================================",
    "node polpetta [path] [port]",
    "node polpetta        server runs in polpetta folder",
    "node polpetta ~/     server runs in specific ~/ folder",
    "./polpetta           same as above.. you need a folder!",
    "./polpetta ./ 8080   runs in polpetta dir with 8080 port",
    "-------------------------------------------------------",
    "The output will describe the folder",
    "and the full URL to use with your browser",
    "_______________________________________________________"
  ].join("\n"));
}
