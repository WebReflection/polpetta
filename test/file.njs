this.onload = function (
  req, res
) {

  var fs = require("fs");

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, this.output);

  if (this.get("upload") != null) {

    // clean up for testing purpose
    this.file.keys().forEach(function (key) {
      [].concat(
        this.file(key)
      ).forEach(function (file) {
        if (!file.error) {
          // if you want to check files
          // put a return here and check
          // the tmp folder
          fs.unlinkSync(
            file.tmp_name
          );
        }
      }, this);
      this.output.push(
        JSON.stringify(this.file(key)), "<br />"
      );
    }, this);

    this.output.push(
      JSON.stringify(this.file.keys()), "<br />"
    );

    // show result
    this.output.push(
      "<hr />",
      JSON.stringify(this.post.keys()), "<br />",
      this.post("text")
    );
  } else {
    this.output.push(
      "<form method='post' enctype='multipart/form-data' action='?upload'>",
        "<input name='test' type='file'/>", "<br />",
        "<input name='test' type='file'/>", "<br />",
        "<input name='text' type='text'/>", "<br />",
        "<input name='single' type='file'/>", "<br />",
        "<input type='submit'/>",
      "</form>"
    );
  }
  this.output.flush();
};