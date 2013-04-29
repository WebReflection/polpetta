// to specify one or more environment variables
// export IP=127.0.0.1
// as example, then node polpetta

const
  NUMERIC_ONLY = /^\d+$/,
  IP_ADDRESS = /^(\d+\.){3}\d+$/;

var
  env = process.env,
  arguments = require('./arguments.js'),
  port = arguments.filter(function (arg) {
    return NUMERIC_ONLY.test(arg);
  })[0];
Object.freeze(module.exports = {

  // privileged over IP address, if specified
  HOST_NAME: String(env.HOST_NAME || ''),

  // is specified host to that IP
  IP: String(env.IP || arguments.filter(function (arg) {
    return IP_ADDRESS.test(arg);
  })[0] ||'0.0.0.0'),

  // if specified, tries to launch in that port
  // it fails instantly if the port if manually set
  // it tries for a new port otherwise
  PORT: parseInt(port || env.PORT || 1337, 10),

  // did anyone actually specified a port ?
  PORT_FROM_PEOPLE: port || env.PORT || '',

  // 3 options so far
  //    0 => NO directory listing
  //    1 => QUICK directory listing, no idae what files are
  //    2 => FULL directory listing, the default
  // In full case all file descriptors have stats attached too
  DIRECTORY_LISTING: parseInt(env.DIRECTORY_LISTING || 2, 10),

  // for .njs files, if updated/changed invalidate the cache
  // and require them again. Otherwise will keep in cache forever.
  FORCE_NJS_RELOAD: Boolean(env.FORCE_NJS_RELOAD || true)

});

