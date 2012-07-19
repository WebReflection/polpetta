
// returns common function to call
// when shit happens
function generateCommonResponses(code) {
  return function(
    output,
    polpetta,
    response
  ) {
    commonResponses.Status = polpetta.code(code);
    response.writeHead(
      code, commonResponses
    );
    response.end();
  }
}