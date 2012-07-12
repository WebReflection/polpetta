this.onload = function (
  req, res
) {
  if (this.get("posted") != null) {
    this.output.push(
      "<!doctype html>",
      this.get("posted"),
      "<br />",
      this.post("test")
    );
  } else {
    this.output.push(
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>",
      "<form method='post' action='?posted=(က) Polpetta'>",
        "<input name='test' type='text'/>",
        "<input type='submit'/>",
      "</form>"
    );
  }
  this.output.flush();
};