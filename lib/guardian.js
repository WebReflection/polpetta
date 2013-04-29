const
  HIDDEN_FILE = /(?:^|\/)\.[^/]*|(?:^|\/)node_modules\/?$/,
  NUMERIC_ONLY = /^\d+$/,
  PATH_SLASHES = /(\\|\/)/g,
  WEB_SEP = '/',
  WEB_SEP_NEGATIVE_LENGTH = -WEB_SEP.length;

var
  fs = require('fs'),
  path = require('path'),
  arguments = require('./arguments.js'),
  systemPath = WEB_SEP === path.sep ?
    String : createPathReplacer(WEB_SEP, path.sep);

function createPathReplacer(find, place) {
  var re = RegExp(
    find.replace(
      PATH_SLASHES, '\\$1'
    ), "g"
  );
  return function (path) {
    return path.replace(
      re, place
    );
  };
}

this.sep = WEB_SEP;

this.root = path.resolve(
  arguments.filter(function (file, i) {
    return !NUMERIC_ONLY.test(file) && fs.existsSync(file);
  })[0] || __dirname
);

this.identify = function resolve(src, decode) {
  src = path.resolve(
    this.root + systemPath(
      decode ? decodeURIComponent(src) : src
    )
  );
  return src.indexOf(this.root) ? '' : src;
};

this.resolve = function resolve(staticAddress) {
  return staticAddress.replace(this.root, '');
};

this.isHidden = function isHidden(src) {
  return HIDDEN_FILE.test(src);
};

Object.freeze(this);