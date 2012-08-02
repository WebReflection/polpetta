
// returns common function to call
// when shit happens
function generateErrorResponses(code) {
  return function() {
    if (!invokedHtaccess.call(
      this,
      code,
      "onerror",
      null
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
