
// main file/directory logic filter
function fileStats(
  file,
  polpetta,
  request,
  response,
  query,
  ext,
  err,
  stats
) {
  var
    notAnError = !err,
    isDir = notAnError && stats.isDirectory(),
    isFile = notAnError && stats.isFile(),
    output = this,
    tmp
  ;
  switch (true) {
    case isFile:
      if (ext == ".njs") {
        requireNJS(
          file,
          output,
          polpetta,
          request,
          response,
          query
        );
      } else {
        tmp = polpetta.type(ext).indexOf("text/") ?
          "binary" : "utf-8"
        ;
        fs.readFile(
          file,
          tmp,
          readFile.bind(
            output,
            polpetta,
            response,
            ext,
            tmp
          )
        );
      }
      break;
    case isDir:
      tmp = findHome(file + SEP);
      if (1 < (tmp.length - file.length)) {
        fs.stat(
          tmp,
          fileStats.bind(
            output,
            tmp,
            polpetta,
            request,
            response,
            query,
            path.extname(file)
          )
        );
      } else if (LIST_FILES_AND_FOLDERS) {
        console.log("TODO");
      } else {
        forbidden(
          output,
          polpetta,
          response
        );
      }
      break;
    default:
      notFound(
        output,
        polpetta,
        response
      );
      break;
  }
}