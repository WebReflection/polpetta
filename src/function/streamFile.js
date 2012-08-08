
// once the file has been read ...
function streamFile(stats) {
  if (!invokedHtaccess.call(
    this,
    200,
    "onstreamfile",
    stats
  )) {
    var stream = fs.createReadStream(this.path, emptyObjet);
    commonStream["Content-Type"] = polpetta_type(this.ext);
    commonStream["Content-Length"] = stats.size;
    this.response.writeHead(200, commonStream);
    stream.on("error", internalServerError.bind(this));
    stream.pipe(this.response);
  }
}
