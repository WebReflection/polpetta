this.onload = function (
  req, res, p
) {

  var fs = require("fs");

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, p.output);

  if (p.get("upload") != null) {

    // clean up for testing purpose
    p.file.keys().forEach(function (key) {
      [].concat(
        p.file(key)
      ).forEach(function (file) {
        if (!file.error) {
          // if you want to check files
          // put a return here and check
          // the tmp folder
          fs.unlinkSync(
            file.tmp_name
          );
        }
      }, p);
      p.output.push(
        JSON.stringify(p.file(key)), "<br />"
      );
    });

    p.output.push(
      JSON.stringify(p.file.keys()), "<br />"
    );

    // show result
    p.output.push(
      "<hr />",
      JSON.stringify(p.post.keys()), "<br />",
      p.post("text")
    );
  } else {
    p.output.push(
      "<form method='post' enctype='multipart/form-data' action='?upload'>",
        "<input name='test' type='file'/>", "<br />",
        "<input name='test' type='file'/>", "<br />",
        "<input name='text' type='text'/>", "<br />",
        "<input name='single' type='file'/>", "<br />",
        "<input type='submit'/>",
      "</form>"
    );
  }
  p.output.flush();
};