
function polpetta_encoding(ext) {
  return getOrDefine(
    polpetta_encoding_cache,
    ext,
    polpetta_encoding_define
  );
}

function polpetta_encoding_define(ext) {
  return polpetta_type(ext).indexOf("text/") ?
    "binary" : "utf-8"
  ;
}

var polpetta_encoding_cache = {};
