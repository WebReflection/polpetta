
// used by the fileSystem
function fileExists(
  file,
  polpetta,
  response,
  ext,
  doesIt
) {
  if (doesIt) {
    var mode = polpetta.type(ext).indexOf("text/") ?
      "binary" : "utf-8"
    ;
    fs.readFile(
      file,
      mode,
      readFile.bind(
        this,
        polpetta,
        response,
        ext,
        mode
      )
    );
  } else {
    notFound(
      this,
      polpetta,
      response
    );
  }
}