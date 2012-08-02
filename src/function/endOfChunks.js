
// remove received, chunks, and i, after
function endOfChunks() {
  this.callback = fsStat.bind(this.polpetta);
  if (this.boundary) {
    this.i = 0;
    this.received = {};
    this.posted = [];
    this.join("").split(this.boundary).forEach(
      endOfChunks.forEach, this
    );
    this.i || endOfChunks.done(this, this.posted.join("&"));
  } else {
    endOfChunks.done(this, this.join(""));
  }
}

endOfChunks.done = function (chunks, posted) {
  var
    callback = chunks.callback,
    polpetta = chunks.polpetta,
    received = chunks.received
  ;
  delete chunks.polpetta;
  delete chunks.callback;
  delete chunks.received;
  delete chunks.posted;
  chunks.length = 0;
  defineGPF(polpetta, "post", querystring.parse(
    posted
  ));
  received && defineGPF(polpetta, "file", received);
  callback();
};

endOfChunks.writeFile = function (file, err) {
  if (err) {
    file.error = err;
  } else {
    file.size = fs.statSync(file.tmp_name).size;
  }
  --this.i || endOfChunks.done(this, this.posted.join("&"));
};

endOfChunks.forEach = function (data, i) {
  var
    line = data.split("\r\n"),
    headers = line.slice(
      1, line.indexOf("", 1)
    ),
    name,
    filename,
    file,
    parse,
    content
  ;
  i = 0;
  while (i < headers.length) {
    parse = headers[i++];
    if (endOfChunks.testName.test(parse)) {
      name = RegExp.$2;
      content = line.slice(
        line.indexOf("", i) + 1, line.length - 1
      ).join("\r\n");
      if (endOfChunks.testFileName.test(parse)) {
        filename = RegExp.$2;
        if (filename.length) {
          file = {
            name: filename,
            type: polpetta_type(
              path.extname(filename),
              "application/octet-stream"
            ),
            error: null,
            size: 0
          };
          if (has(this.received, name)) {
            if (this.received[name] instanceof Array) {
              this.received[name].push(file);
            } else {
              this.received[name] = [this.received[name], file];
            }
          } else {
            this.received[name] = file;
          }
          this.i++;
          fs.writeFile(
            file.tmp_name = path.join(
              TMP, name + Math.random() + filename
            ),
            content,
            "binary",
            endOfChunks.writeFile.bind(
              this,
              file
            )
          );
        }
      } else if (content.length) {
        this.posted.push(
          encodeURIComponent(name) +
          "=" +
          encodeURIComponent(content)
        );
      }
      break;
    }
  }
};

endOfChunks.testFileName = /filename=("|')?([^\1]*?)\1/;
endOfChunks.testName = /name=("|')?([^\1]*?)\1/;
