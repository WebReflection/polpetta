
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
    tmp
  ;
  switch (true) {
    case isFile:
      if (ext == ".njs") {
        serveNJS(
          output,
          file,
          polpetta,
          request,
          response,
          client,
          query
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
      tmp = client.pathname;
      if (tmp.slice(WEB_SEP_NEGATIVE_LENGTH) != WEB_SEP) {
        redirect.Location = tmp + WEB_SEP;
        response.writeHead(
          301, redirect
        );
        return response.end();
      }
      // resolved already as system file
      // no need to file = systemPath(file);
      tmp = findHome(file + SEP);
      if (1 < (tmp.length - file.length)) {
        ext = path.extname(tmp);
        if (ext == ".njs") {
          serveNJS(
            output,
            tmp,
            polpetta,
            request,
            response,
            client,
            query
          );
        } else {
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
              ext
            )
          );
        }
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