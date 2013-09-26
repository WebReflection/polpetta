
function polpetta_header(type) {
  //TODO: auto-allow CORS for njs files (now they must be explicit).
  return CORS? {
    "Content-Type": getOrDefine(
      polpetta_header_cache,
      type,
      polpetta_header_define
    ),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Referer, User-Agent, *",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, UPDATE, OPTIONS, *"
    } :
    {"Content-Type": getOrDefine(
          polpetta_header_cache,
          type,
          polpetta_header_define
    )};
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
