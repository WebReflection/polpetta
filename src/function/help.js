
// if you do something wrong ...
// or you simply need help
function help() {
  console.log([
    "=======================================================",
    "      (က) Polpetta, any folder is served spiced",
    "=======================================================",
    "node polpetta [path] [port] [--https] [--cors]",
    "node polpetta              server runs in polpetta folder",
    "node polpetta ~/           server runs in specific ~/ folder",
    "./polpetta                 same as above.. you need a folder!",
    "./polpetta ./ 8080         runs in polpetta dir with 8080 port",
    "node polpetta [path] [hostname:port]",
    "./polpetta 0.0.0.0:8080    runs using 0.0.0.0 as host address",
    "--https                    will listen on https instead of http",
    "--cors                     allows Cross Origin Request on any non njs file",
    "-------------------------------------------------------",
    "The output will describe the folder",
    "and the full URL to use with your browser",
    "_______________________________________________________"
  ].join("\n"));
}
