
function grabChunks(chunk) {
  this.push(chunk);
}

grabChunks.writeFile = function (self, err) {
  if (err) {
    this.error = err;
  } else {
    this.size = fs.statSync(this.tmp_name).size;
  }
  --self.i || self.callback();
};

grabChunks.forEach = function (data, i) {
  var
    line = data.split("\r\n"),
    headers = line.slice(
      1, line.indexOf("", 1)
    ),
    i = 0,
    name,
    filename,
    file,
    parse,
    content
  ;
  while (i < headers.length) {
    parse = headers[i++];
    if (grabChunks.testName.test(parse)) {
      name = RegExp.$2;
      content = line.slice(
        line.indexOf("", i) + 1, line.length - 1
      ).join("\r\n");
      if (grabChunks.testFileName.test(parse)) {
        filename = RegExp.$2;
        if (filename.length) {
          file = {
            name: filename,
            type: polpetta.type(
              path.extname(filename),
              "application/octet-stream"
            ),
            error: null,
            size: 0
          };
          if (this.file.hasOwnProperty(name)) {
            if (this.file[name] instanceof Array) {
              this.file[name].push(file);
            } else {
              this.file[name] = [this.file[name], file];
            }
          } else {
            this.file[name] = file;
          }
          this.i++;
          fs.writeFile(
            file.tmp_name = path.join(
              TMP, name + Math.random() + filename
            ),
            content,
            "binary",
            grabChunks.writeFile.bind(
              file,
              this
            )
          );
        }
      } else if (content.length) {
        this.push(
          encodeURIComponent(name),
          "=",
          encodeURIComponent(content)
        );
      }
      break;
    }
  }
};

grabChunks.end = function (
  boundary,
  file,
  polpetta,
  request,
  response,
  client,
  query,
  ext
) {
  if (boundary) {
    var output = this.splice(0, this.length);
    this.file = {};
    this.i = 0;
    this.callback = grabChunks.end.bind(
      this,
      null,
      file,
      polpetta,
      request,
      response,
      client,
      query,
      ext
    );
    output.join("").split(boundary).forEach(
      grabChunks.forEach, this
    );
    this.i || this.callback();
  } else {
    if ("callback" in this) {
      delete this.i;
      delete this.callback;
    }
    fs.stat(
      file,
      fileStats.bind(
        this,
        file,
        polpetta,
        request,
        response,
        client,
        query,
        ext
      )
    );
  }
};

grabChunks.testFileName = /filename=("|')([^\1]*?)\1/;
grabChunks.testName = /name=("|')([^\1]*?)\1/;

