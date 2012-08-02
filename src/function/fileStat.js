
function fileStat(err, stats) {
  var
    notAnError = !err,
    isDir = notAnError && stats.isDirectory(),
    isFile = notAnError && stats.isFile(),
    ext,
    tmp
  ;
  switch(true) {
    case isFile:
      ext = assignExt.call(this);
      if (ext == ".njs") {
        requireNJS.call(this);
      } else {
        fs.readFile(
          this.path,
          polpetta_encoding(ext),
          readFile.bind(this)
        );
      }
      break;
    case isDir:
      tmp = this.url.pathname;
      if (tmp.slice(WEB_SEP_NEGATIVE_LENGTH) != WEB_SEP) {
        redirect.Location = tmp + WEB_SEP;
        this.response.writeHead(
          301, redirect
        );
        return this.response.end();
      }
      tmp = findHome(this.path + SEP);
      if (1 < (tmp.length - this.path.length)) {
        this.path = tmp;
        ext = assignExt.call(this);
        if (ext == ".njs") {
          this.path = tmp;
          requireNJS.call(this);
        } else {
          fs.stat(
            tmp,
            fileStat.bind(this)
          );
        }
      } else if (LIST_FILES_AND_FOLDERS) {
        fs.readdir(
          this.path,
          readDir.bind(this)
        );
      } else {
        forbidden.call(this);
      }
      break;
    default:
      notFound.call(this);
      break;
  }
}