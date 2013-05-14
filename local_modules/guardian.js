const
  HIDDEN_FILE = /(?:^|\/)\.[^/]*|(?:^|\/)node_modules\/?$/,
  HTML_ENTITIES = /[<>"'&]/g,
  HTML_ESCAPED_ENTITIES = /&(?:lt|gt|quot|apos|amp);/g,
  NUMERIC_ONLY = /^\d+$/,
  PATH_SLASHES = /(\\|\/)/g,
  WEB_SEP = '/',
  WEB_SEP_NEGATIVE_LENGTH = -WEB_SEP.length;

var
  fs = require('fs'),
  path = require('path'),
  arguments = require('./arguments.js'),
  systemPath = WEB_SEP === path.sep ?
    String : createPathReplacer(WEB_SEP, path.sep),
  htmlChar = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '"': '&apos;',
    '&': '&amp;'
  },
  entitiesChar = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&'
  };

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

function entitiesReplacer(match) {
  return htmlChar[match];
}

function entitiesReviver(match) {
  return entitiesChar[match];
}

this.sep = WEB_SEP;

this.root = path.resolve(
  arguments.filter(function (file, i) {
    return !NUMERIC_ONLY.test(file) && fs.existsSync(file);
  })[0] || __dirname
);

this.length = this.root.length;

this.identify = function identify(src, decode) {
  src = path.resolve(
    this.root + systemPath(
      decode ? decodeURIComponent(src) : src
    )
  );
  return src.indexOf(this.root) ? '' : src;
};

this.resolve = function resolve(src, decode) {
  src = this.identify(src.replace(this.root, ''), decode);
  return src && src.slice(this.length);
};

this.escape = function escape(src) {
  return src.replace(HTML_ENTITIES, entitiesReplacer);
};

this.unescape = function escape(src) {
  return src.replace(HTML_ESCAPED_ENTITIES, entitiesReviver);
};

this.isHidden = function isHidden(src) {
  return HIDDEN_FILE.test(src);
};

Object.freeze(this);