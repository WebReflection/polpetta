
// when stuff is done, flush the output
// this.output.push("What", "Ever");
// this.output.flush(200, "html");
function flushResponse(
  polpetta,
  response,
  code,
  type,
  encode
) {
  var length = this.length;
  // output.flush("html");
  // output.flush(".html");
  // output.flush("text/html");
  // => 200, text/html
  if (
    type == null &&
    typeof code == "string"
  ) {
    type = code;
    code = 200;
  }
  // output.flush(); => 200, text/html
  if (!code) {
    code = length ? 200 : 404;
  }
  response.writeHead(
    code,
    polpetta.header(type || "text/html")
  );
  // 304, 404, Not Found ... etc etc ...
  response.end(
    length ?
      this.join("") :
      polpetta.code(code),
    encode || "utf-8"
  );
}