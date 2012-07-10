
// returns common function to call
// when shit happens
function generateCommonResponses(code) {
  return function(
    output,
    polpetta,
    response
  ) {
    output.push(
      polpetta.code(code)
    );
    return flushResponse.call(
      output,
      polpetta,
      response,
      code
    );
  };
}