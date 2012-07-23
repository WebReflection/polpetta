(က) Polpetta
===========================
any folder is served spiced

![polpetta at work](http://www.3site.eu/images/polpetta_shell.png)
___________________________


What Is Polpetta
----------------
*polpetta* is a script able to initialize a [node.js](http://nodejs.org/) server in any folder you want
`node polpetta ~/path` is basically all you need to start surfing the `~/path` folder as if it is a web-server with the plus that any *file.njs* inside that folder will act as *node.js* module.
Here [the most basic example of an *index.njs* file](https://github.com/WebReflection/polpetta/blob/master/test/index.njs).

In few words, **polpetta is the easiest way for quick prototyping with both client files and node.js modules**.


Platforms
---------
*polpetta* should just work wherever a recent version of node.js is available.
Known platforms are **Linux**, **Mac**, and **Windows** where for latter one the *polpetta.cmd* file will simply start a polpetta server through double click.


Oh Gosh ... Why
---------------
I am maintaining different projects and I am sick of setting up a web-server per each project.
You might have noticed that most **recent browsers do not let us test through the *file://* protocol anymore** and this is the most annoying thing ever for a developer, imho.
You might be a *node.js* modules developer too and sometimes an easy way to test your modules is all you need.
With *polpetta* you can create as many server as you want per each folder and test them without setting up a damn thing.
Accordingly, if you develop anything for the web or the *node.js* community, *polpetta* could be exactly the solution to all your problems.


Usage
-----
Same as [serverdir](https://github.com/remy/servedir)

    polpetta [path] [port]

  * **path**, the folder you want to use as web-server root, by default is where *polpetta* is
  * **port**, the port you want to use, by default *polpetta* finds a free port automatically

Bear in mind if you specify a port and it's not available, *polpetta* will exit with a notice in console.

If you don't remember later on ... `polpetta --help` or `polpetta -h` to have some hint.


OK, How Do I Start
------------------
Well, the very first step is to grab *polpetta*, either via `git clone git://github.com/WebReflection/polpetta.git` or simply getting the unique file.

You can install *polpetta* through `npm install polpetta -g` or you can grab directly a freshly baked polpetta:

    # go in a directory, if emty is better
    # grab the built file from this repo
    curl -0 https://raw.github.com/WebReflection/polpetta/master/build/polpetta >polpetta

    # if you don't want to make
    # polpetta executable
    # point to polpetta via node
    node ~/the/path/where/is/polpetta

    # if you want make it executable
    # be sure polpetta firstline points to the right
    # bin folder with node then chmod it
    chmod +x polpetta

    # if that is the case, test if it runs via
    # and exit via Ctrl+C or simply go to
    # the http://address:port/ showed and start playing
    ./polpetta

You should see something like this in your console (I have used the /tmp folder here)

![polpetta at work](http://www.3site.eu/images/polpetta_shell.png)


    # if you want make your life easier and call
    # polpetta from anywhere, hoping you have not
    # configured node as super user ( this could hurt )
    which node
    # output: /usr/local/bin/node

    # move the file into that bin folder
    [sudo] mv polpetta /usr/local/bin

    # now, whatever folder you want ..
    polpetta ~/myhtml/only/website/

    # and you are ready to go

If you want clone this repository, help me improving *polpetta* or do some test/change, remember to `make` in order to build *polpetta* in the build folder then `node build/polpetta ../test` or any other path you like.


Make options
------------
  * **build**, the default one, creates a freshly new backed *polpetta* in the *build/* folder
  * **clean**, remove the build folder and everything included
  * **types**, grab the Apache file, parse it, overwrite the [EXTENSION_TO_MIME.js](https://github.com/WebReflection/polpetta/blob/master/src/EXTENSION_TO_MIME.js) file and build *polpetta* again


What About .njs Files
---------------------
If the file extension is **.njs** it is **executed PHP style** but with the whole power of node.js.
You can `require("module")` and do what you want and you receive per each web-server call the **request** and the **response** object.
All you have to do in your file is to export an `onload` function. This function will be called with a spiced up *polpetta* with some utility but you don't really have to use them, just do what you want.

    // generic.njs file
    this.onload = function (
      request,
      response,
      polpetta
    ) {
      var fs = require("fs");
      fs.writeFileSync("gotcha.txt", "it works");
      response.end();
      // note that polpetta here points
      // to a polpetta clone enriched
      // with some utility
      // and an output object
    };


What About External npm Modules
-------------------------------
There are two options here, the easy one and the even easier.
The easy one is about cloning the repository, perform `npm install mymodule` inside the repository, use *make* and discover that **modules are also included in the *build/* folder**.
Since that is gonna be the folder where the application is running in any case, modules are resolved through `require()` via that folder.
If you want to keep updated the globally executable *polpetta*, you might decide to add this line to the *Makefile* build process: `cp -R build/* /usr/local/bin`

The even easier way is to install your most used modules globally via `npm install module -g` so that these will be available in any case through the node.js `require()` mechanism and you update one place rather than all of them, if necessary.


Polpetta API
------------
You can find almost everything documented in the [polpetta.js](https://github.com/WebReflection/polpetta/blob/master/src/polpetta.js) file.
What you won't find there is a `polpetta.get(key[, default])` method, used to retrieve query string properties as it is for the PHP `$_GET[$key]` global, a `polpetta.post(key[, default])` method to retrieve posted data, a `polpetta.cookie(key[, default])` method, to get cookie, followed by `polpetta.cookie.set(key, value)` to set them.
All these objects have a `obj.keys()` method too to retrieve all parsed keys for *get*, *post*, *cookie*, or *file*.

You can see an examples for [cookie](https://github.com/WebReflection/polpetta/blob/master/test/cookie.njs), [get or post](https://github.com/WebReflection/polpetta/blob/master/test/post.njs), and [files upload](https://github.com/WebReflection/polpetta/blob/master/test/file.njs) in the test folder.

Last, but not least, there is a `polpetta.output` **Array** property where you can push your content and `polpetta.output.flush([type || [code, type]])` once you have done.
Bear in mind this is not a good technique to serve big files on the fly but that's not the purpose of the `output` property.

    // example of get and output
    this.onload = function (req, res, p) {
      p.output.push(
        "Hello ",
          p.get("name",
            // default if not present
            "unknown"
          ),
        "!"
      );
      p.output.flush("txt");
    };

    // produced output for localhost:port
    Hello unknown!

    // produced output for localhost:port/?name=Polpetta
    Hello Polpetta!


TODOs
-----
  * add .htaccess like mechanism for the root folder as ..
    * hidden file from any folder request ( no ajax, images, etc ... )
    * one shot requiring during initialization and as node module
    * possibility to intercept 404, 500, and all others
    * possibility to serve different content per extension ... e.g. .md files
    * rewrite rules through JS regexp
    * something else I am still thinking about ...
  * add default favicon with polpetta logo
  * I believe after that there's not much left, except creating automation tests through phantom js and wru

License
-------
This *polpetta* project is under the Mit Style License

    Copyright (C) 2011 by Andrea Giammarchi, @WebReflection

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

Logo
----
Polpetta means meatball and I am not a graphic designer at all ... so this is all I could do but if you want to create a better logo, you'll be credited and I'll pay you a beer, cheers :D

![logo](https://github.com/WebReflection/polpetta/raw/master/test/img/polpetta.png)