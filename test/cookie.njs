this.onload = function (
  req, res
) {
  var key = "__test__";

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, this.output);

  if (
    this.cookie(key + "1") != null &&
    this.cookie(key + "2") != null
  ) {
    this.output.push(
      JSON.stringify(this.cookie.keys()), "<br />",
      this.cookie(key + "1"), "<br />",
      this.cookie(key + "2")
    );
  } else {
    this.output.push(
      "<a href='?'>click here to test cookies</a>"
    );

    // to set a cookie you need a header
    // object
    this.cookie.set(
      key + "1", "(က) Polpetta 1"
    );
    this.cookie.set(
      key + "2", "(က) Polpetta 2"
    );
  }

  // flush passing the header
  this.output.flush(
    200,
    this.header("html")
  );
};