
var systemPath = SEP == WEB_SEP ?
  function (path) {
    return path;
  } :
  function (path) {
    return path.replace(
      systemPath.re,
      SEP
    );
  }
;

systemPath.re = RegExp(WEB_SEP, "g");