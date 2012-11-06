
// onrequest should be intercepted even before the filestat check
// however, get, post, cookie, and file should be available already
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
      } else if (STREAM_FILES_BIGGER_THAN < stats.size) {
        streamFile.call(this, stats);
      } else {
        fs.readFile(
          this.path,
          polpetta_encoding(ext),
          readFile.bind(this)
        );
      }
      break;
    case isDir:
      tmp = getCurrentPathName(this);
      if (tmp.slice(WEB_SEP_NEGATIVE_LENGTH) != WEB_SEP) {
        return polpetta_redirect.call(this, tmp + WEB_SEP);
      }
      tmp = findHome(this.path + SEP);
      if (1 < (tmp.length - this.path.length)) {
        defineNotConfigurableProperty(this, "path", tmp);
        ext = assignExt.call(this);
        if (ext == ".njs") {
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
        forbidden.call(this, stats);
      }
      break;
    default:
      notFound.call(this, stats);
      break;
  }
}
