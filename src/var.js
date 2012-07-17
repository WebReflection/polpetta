
// local variables
var
  polpetta = {},
  fs = require("fs"),
  http = require("http"),
  querystring = require("querystring"),
  url = require("url"),
  path = require("path"),
  arguments = process.argv.filter(function (value) {
    return this.found ?
      value :
      this.found = ~value.indexOf("polpetta")
    ;
  }, {}).slice(1),
  HOST_USER_PORT = arguments.length == 1 ?
    (/^\d+$/.test(arguments[0]) ?
      arguments[0] : arguments[1]) :
    arguments[1]
  ,
  port =  HOST_USER_PORT ||
          HOST_INITIAL_PORT,
  server = http.createServer(
    createServer
  ),
  DIR = __dirname,
  SEP = path.sep,
  HEADERS = {},
  keys = Object.keys,
  polpettaKeys
;
