this.onload = function (
  req, res, p
) {

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, p.output);

  if (p.post("single") != null) {
    p.output.push(
      JSON.stringify(p.get.keys()),
      "<br />",
      JSON.stringify(p.get("test")),
      "<br />",
      JSON.stringify(p.get("single")),
      "<hr />",
      JSON.stringify(p.post.keys()),
      "<br />",
      JSON.stringify(p.post("test")),
      "<br />",
      JSON.stringify(p.post("single"))
    );
  } else {
    p.output.push(
      "<form method='post' action='?test=(က) Polpetta&test=second&single=OK'>",
        "<input name='test' type='text'/>",
        "<input name='test' type='text'/>",
        "<input name='single' type='text'/>",
        "<input type='submit'/>",
      "</form>"
    );
  }
  p.output.flush();
};