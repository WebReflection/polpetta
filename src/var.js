
// local variables
var
  // version
  version = "0.3.7",

  // dependencies
  ru = FORCE_NJS_RELOAD ?
    require('require-updated') :
    require
  ,
  fs = require("fs"),
  http = require("http"),
  https = require('https'),
  zlib = require("zlib"),
  querystring = require("querystring"),
  stream = require("stream"),
  url = require("url"),
  path = require("path"),
  env = process.env,

  // from globals
  keys = Object.keys,
  freeze = Object.freeze,
  defineProperty = Object.defineProperty,

  stats = freeze(new fs.Stats),

  // internal objects
  redirect = {
    Location: null
  },
  commonDescriptor = {
    enumerable: true,
    writable: false,
    configurable: false,
    value: null
  },
  commonResponses = {
    Connection: "close",
    Status: "",
    "Status-Code": 0
  },
  commonStream = {
    "Content-Type": "",
    "Content-Length": 0
  },
  emptyObjet = {},
  event = defineNotConfigurableProperty(
    defineKnownProperty(
      {}, "preventDefault", function () {
        event.defaultPrevented = true;
      }
    ),
    "defaultPrevented",
    false
  ),
  arguments = resolveArguments(process.argv),
  SSL = !!(~arguments.indexOf('--https') && arguments.splice(arguments.indexOf('--https'), 1)),
  CORS = !!(~arguments.indexOf('--cors') && arguments.splice(arguments.indexOf('--cors'), 1)),
  // internal constants
  CWD = process.cwd(),
  HOST_USER_PORT = findPort(arguments),
  SEP = path.sep,
  WEB_SEP = "/",
  WEB_SEP_NEGATIVE_LENGTH = -WEB_SEP.length,
  TMP = env.TMP || env.TMPDIR || env.TEMP || CWD,
  port =  HOST_USER_PORT ||
          HOST_INITIAL_PORT,
  root = polpetta_root(arguments),
  HOST_USED = HOST_NAME || findHost(arguments) || "localhost",

  // RegExp constants
  BOUNDARY_MATCH = /boundary=([^;]+)/,
  PATH_SLASHES = /(\\|\/)/g,
  HIDDEN_FILE = /(?:^|\/)\.[^/]*|(?:^|\/)node_modules\/?$/,

  // placeholder for post and file property
  emptyGetter = withKeysMethod(
    getValue,
    {}
  ),

  // common/reused variables
  server,
  systemPath, webPath,
  htaccess,
  htaccessPath,
  postedData
;

if (SEP == WEB_SEP) {
  systemPath = webPath = function (path) {
    return path;
  };
} else {
  systemPath = createPathReplacer(WEB_SEP, SEP);
  webPath = createPathReplacer(SEP, WEB_SEP);
}
