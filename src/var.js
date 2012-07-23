
// local variables
var
  // dependencies
  fs = require("fs"),
  http = require("http"),
  querystring = require("querystring"),
  stream = require("stream"),
  url = require("url"),
  path = require("path"),
  env = process.env,

  // from globals
  keys = Object.keys,
  defineProperty = Object.defineProperty,

  // internal objects
  polpetta = {},
  redirect = {
    Location: null
  },
  commonResponses = {
    Connection: "close",
    Status: ""
  },
  event = defineImmutableProperties({}, {
    preventDefault: function () {
      event.defaultPrevented = true;
    }
  }),
  arguments = process.argv.filter(function (value) {
    return this.found ?
      value :
      this.found = ~value.indexOf("polpetta")
    ;
  }, {}).slice(1),

  // internal constants
  CWD = process.cwd(),
  HOST_USER_PORT = (/^(\d+)$/.test(arguments[0]) ||
                   /^(\d+)$/.test(arguments[1])) &&
                   RegExp.$1
  ,
  SEP = path.sep,
  WEB_SEP = "/",
  WEB_SEP_NEGATIVE_LENGTH = -WEB_SEP.length,
  HEADERS = {},
  TMP = env.TMP || env.TMPDIR || env.TEMP || CWD,
  port =  HOST_USER_PORT ||
          HOST_INITIAL_PORT,

  // common/reused variables
  polpettaKeys,
  server,
  systemPath, webPath,
  htaccess,
  htaccessPath
;

if (SEP == WEB_SEP) {
  systemPath = webPath = function (path) {
    return path;
  };
} else {
  systemPath = createPathReplacer(WEB_SEP, SEP);
  webPath = createPathReplacer(SEP, WEB_SEP);
}
