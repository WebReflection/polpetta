
function polpetta_code(code) {
  return  http.STATUS_CODES[code] ||
          "Internal Server Error";
}
