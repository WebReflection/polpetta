
// returns common function to call
// when shit happens
function generateErrorResponses(code) {
  return function(data) {
    if (!invokedHtaccess.call(
      this,
      code,
      "onerror",
      data
    )) {
      commonResponses["Status-Code"] = code;
      commonResponses.Status = this.code(code);
      this.response.writeHead(
        code, commonResponses
      );
      this.response.end();
    }
  }
}
