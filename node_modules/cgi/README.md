node-cgi
========
### An http/stack/connect layer to invoke and serve CGI executables.


This module implements [RFC 3875][rfc3875], and offers an easy interface to run
and serve CGI executables using [Node][]'s HTTP server. I wrote this so I could
directly serve [GitWeb][node-gitweb] through Node.


CGI Scripts?
------------

If you're not familiar with CGI scripts, they're simply executable files that
get invoked by a web server with client requests. The script has Environment
Variables set that indicate information about the HTTP request the client has sent.

Here's what a simple "Hello World" CGI script in `sh` would look like:

``` bash
#!/bin/sh

# Headers are written first. The special "Status"
# header indicates the response status code
echo "Status: 200"
echo "Content-Type: text/plain"
echo
    
# Followed by a response body
echo "Hello World!"
```

Let's call it `hello.cgi`. Be sure to make it executable with `chmod +x hello.cgi`!


Invoking "The Script" with Node
-------------------------------

Now, we need to set up our Node HTTP server. For every request sent to the server,
our `hello.cgi` script will be invoked, and the response will be sent back to the
HTTP client:

``` javascript
var cgi = require('cgi');
var http = require('http');
var path = require('path');

var script = path.resolve(__dirname, 'hello.cgi');

http.createServer( cgi(script) ).listen(80);
```

This will set up a CGI handler with the default options.


License
-------

(The MIT License)

Copyright (c) 2012 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Node]: http://nodejs.org
[node-gitweb]: https://github.com/TooTallNate/node-gitweb
[rfc3875]: http://tools.ietf.org/html/rfc3875
