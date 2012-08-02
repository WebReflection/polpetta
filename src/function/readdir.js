
// used to show a directory content
function readDir(err, files) {
  var dirName = this.path;
  if (err) {
    internalServerError.call(this);
  } else {
    dirName = WEB_SEP + webPath(
      dirName.replace(root, "")
    );
    this.output.push(
      "<!doctype html>",
      "<html>",
        "<head>",
          "<title>Index of ", dirName, "</title>",
          '<meta name="viewport" content="',
            'width=device-width,',
            'initial-scale=1.0,',
            'maximum-scale=1.0,',
            'user-scalable=no',
          '"/>',
          '<meta name="generator" content="polpetta" />',
        "</head>",
        "<body>",
          "<strong>Index of " + dirName + "</strong>",
          "<ul>"
    );
    if (dirName != WEB_SEP) {
      this.output.push(
        '<li><a href="..">..</a></li>'
      );
    }
    files.forEach(readDir.forEach, this.output);
    this.output.push(
          "</ul>",
        "</body>",
      "</html>"
    );
    this.output.flush(200, "text/html", "utf-8");
  }
}

readDir.forEach = function (name) {
  if (!HIDDEN_FILE.test(name)) {
    this.push(
      '<li><a href="' + name + '">' + name + '</a></li>'
    );
  }
};
