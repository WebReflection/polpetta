
// once the file has been read ...
function streamFile(stats) {
  if (!invokedHtaccess.call(
    this,
    200,
    "onstreamfile",
    stats
  )) {
    var
      stream = fs.createReadStream(this.path, emptyObjet),
      acceptEncoding = contentEncoding(
        this.request.headers['accept-encoding']
      )
    ;
    commonStream["Content-Type"] = polpetta_type(this.ext);
    commonStream["Content-Length"] = stats.size;
    // TODO: avoid if already binary
    if (acceptEncoding) {
      //http://nodejs.org/api/zlib.html
      commonStream["Content-Encoding"] = acceptEncoding;
      stream = stream.pipe(acceptEncoding === "deflate" ?
        zlib.createDeflate() : zlib.createGzip()
      );
    }
    this.response.writeHead(200, commonStream);
    stream.on("error", internalServerError.bind(this));
    stream.pipe(this.response);
  }
}
