
// main file/directory logic filter
function fileStats(
  file,
  polpetta,
  request,
  response,
  client,
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
    files,
    posted,
    tmp
  ;
  switch (true) {
    case isFile:
      if (ext == ".njs") {
        if (request.method == "POST") {
          files = output.file;
          posted = querystring.parse(
            output.join("")
          );
          output = [];
        }
        requireNJS(
          file,
          output,
          polpetta,
          request,
          response,
          client,
          query,
          posted,
          files
        );
      } else {
        tmp = polpetta.encoding(ext);
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
            client,
            query,
            path.extname(file)
          )
        );
      } else if (LIST_FILES_AND_FOLDERS) {
        fs.readdir(
          file,
          readDir.bind(
            output,
            polpetta,
            response,
            file
          )
        );
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