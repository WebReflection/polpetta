
// once the file has been read ...
function readFile(
  polpetta,
  response,
  file,
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
  } else if (!invokedHtaccess(
    "onstaticfile",
    polpetta,
    null,
    response,
    file,
    ext,
    data
  )) {
    response.writeHead(
      200,
      polpetta.header(ext)
    );
    response.end(data, mode);
  }
}