this.onload = function (
  req, res
) {

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, this.output);

  if (this.post("single") != null) {
    this.output.push(
      JSON.stringify(this.get.keys()),
      "<br />",
      JSON.stringify(this.get("test")),
      "<br />",
      JSON.stringify(this.get("single")),
      "<hr />",
      JSON.stringify(this.post.keys()),
      "<br />",
      JSON.stringify(this.post("test")),
      "<br />",
      JSON.stringify(this.post("single"))
    );
  } else {
    this.output.push(
      "<form method='post' action='?test=(က) Polpetta&test=second&single=OK'>",
        "<input name='test' type='text'/>",
        "<input name='test' type='text'/>",
        "<input name='single' type='text'/>",
        "<input type='submit'/>",
      "</form>"
    );
  }
  this.output.flush();
};