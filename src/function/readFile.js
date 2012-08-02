
// once the file has been read ...
function readFile(
  err,
  data
) {
  if (err) {
    internalServerError.call(this, err);
  } else if (!invokedHtaccess.call(
    this,
    200,
    "onstaticfile",
    data
  )) {
    this.response.writeHead(
      200, this.header(this.ext)
    );
    this.response.end(
      data, polpetta_encoding(this.ext)
    );
  }
}
