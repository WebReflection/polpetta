
var webPath = SEP == WEB_SEP ?
  function (path) {
    return path;
  } :
  function (path) {
    return path.replace(
      webPath.re,
      WEB_SEP
    );
  }
;

webPath.re = RegExp(SEP, "g");