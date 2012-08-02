
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
  	path && c.push("path=" + path);
  	domain && c.push("domain=" + domain);
  	secure && c.push("secure");
		this.push(c.join(';'));
}
