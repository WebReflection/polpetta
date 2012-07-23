this.onload = function (
  req, res, p
) {
  var key = "__test__";

  [
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>",
      "<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'/>"
  ].forEach(function (html) {
    this.push(html);
  }, p.output);

  if (
    p.cookie(key + "1") != null &&
    p.cookie(key + "2") != null
  ) {
    p.output.push(
      JSON.stringify(p.cookie.keys()), "<br />",
      p.cookie(key + "1"), "<br />",
      p.cookie(key + "2")
    );
  } else {
    p.output.push(
      "<a href='?'>click here to test cookies</a>"
    );

    // to set a cookie you need a header
    // object
    p.cookie.set(
      key + "1", "(က) Polpetta 1"
    );
    p.cookie.set(
      key + "2", "(က) Polpetta 2"
    );
  }

  // flush passing the header
  p.output.flush(
    200,
    p.header("html")
  );
};