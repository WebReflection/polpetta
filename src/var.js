
// local variables
var
  polpetta = {},
  fs = require("fs"),
  http = require("http"),
  path = require("path"),
  arguments = process.argv.filter(function (value) {
    return this.found ?
      value :
      this.found = ~value.indexOf("polpetta")
    ;
  }, {}).slice(1),
  port = HOST_INITIAL_PORT,
  server = http.createServer(
    createServer
  ),
  DIR = __dirname,
  SEP = path.sep,
  HEADERS = {},
  keys
;
