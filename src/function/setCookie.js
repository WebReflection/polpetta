
function setCookie(name, value, exp, path, domain, secure) {
		var c = [];
		c.push(escape(name) + '=' + escape(value));
		if(exp > 0) {
			c.push(
			  "expires=" + new Date(
			    new Date + (exp * 86400000)
			  ).toGMTString()
			);
		}
  	path && c.push("path=" + escape(path));
  	domain && c.push("domain=" + escape(domain));
  	secure && c.push("secure");
		return c.join(';');
}

setCookie.flush = function (header) {
  if("__cookie__" in header) {
    header["Set-Cookie"] =
    header.__cookie__.join(";");
  }
  return header;
};