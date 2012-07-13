this.onload = function (
  req, res
) {
  var header = this.header("html");
  if (this.cookie("test") != null) {
    this.output.push(
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>",
      this.cookie("test")
    );
  } else {
    this.output.push(
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>",
      "<a href='?'>click here to test cookies</a>"
    );

    // to set a cookie you need a header
    // object
    this.cookie(header).set(
      'test', '(က) Polpetta'
    );
  }

  // flush passing the header
  this.output.flush(200, header);
};