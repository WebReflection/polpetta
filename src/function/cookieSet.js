
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

