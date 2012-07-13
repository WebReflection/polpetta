function cookieSet(name, value, exp, path, domain, secure) {
		var c = new Array();
		c.push(name + '=' + escape(value));
		var e = (exp > 0);
		if(e) {
			var n = new Date();
			exp = new Date(n.getTime()+(exp*86400000));
			c.push('expires='+exp.toGMTString());
		}
		if(path){c.push('path='+path);}
		if(domain){c.push('domain='+domain);}
		if(secure){c.push('secure');}
		return c.join(';');
}

this.onload = function (
  req, res
) {
  var header = this.header("html");
  if (this.cookie("test") != null) {
    this.output.push(
      "<!doctype html>",
      this.cookie("test")
    );
  } else {
    header['Set-Cookie'] = cookieSet('test', '(က) Polpetta');
    this.output.push(
      "<!doctype html>",
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>",
      "<a href='?'>click here to test cookies</a>"
    );
  }
  this.output.flush(200, header);
};