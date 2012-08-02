
function polpetta_header(type) {
  return {
    "Content-Type": getOrDefine(
      polpetta_header_cache,
      type,
      polpetta_header_define
    )
  };
}

function polpetta_header_define(type) {
  ~type.indexOf("/") || (
    type = polpetta_type(type)
  );
  type.indexOf("text/") || (
    type += ";charset=utf-8"
  );
  return type;
}

var polpetta_header_cache = {};