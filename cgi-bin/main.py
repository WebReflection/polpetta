#!/usr/bin/env python

print "Content-type:text/html\r\n";
print """
<html>
<head>
<title>Polpetta support for proper CGI</title>
</head>
<body>
<h2>Hello Word! This is my first CGI program</h2>
<div>"""
import os
print os.getenv('QUERY_STRING', '');
print """
</div>
<a href="?foo=bar&baz=bak">try with some parameters</a>
</body>
</html>
"""
