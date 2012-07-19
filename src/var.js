
// local variables
var
  polpetta = {},
  fs = require("fs"),
  http = require("http"),
  querystring = require("querystring"),
  stream = require("stream"),
  url = require("url"),
  path = require("path"),
  env = process.env,
  arguments = process.argv.filter(function (value) {
    return this.found ?
      value :
      this.found = ~value.indexOf("polpetta")
    ;
  }, {}).slice(1),
  CWD = process.cwd(),
  HOST_USER_PORT = (/^(\d+)$/.test(arguments[0]) ||
                   /^(\d+)$/.test(arguments[1])) &&
                   RegExp.$1
  ,
  DIR = __dirname,
  SEP = path.sep,
  HEADERS = {},
  TMP = env.TMP || env.TMPDIR || env.TEMP || CWD,
  port =  HOST_USER_PORT ||
          HOST_INITIAL_PORT,
  keys = Object.keys,
  defineProperty = Object.defineProperty,
  polpettaKeys,
  server
;
