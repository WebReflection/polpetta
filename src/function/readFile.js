
// once the file has been read ...
function readFile(
  polpetta,
  response,
  ext,
  mode,
  err,
  data
) {
  if (err) {
    internalServerError(
      this,
      polpetta,
      response
    );
  } else {
    response.writeHead(
      200,
      polpetta.header(ext)
    );
    response.end(data, mode);
  }
}