(က) Polpetta
============
any folder is served spiced
___________________________


What Is Polpetta
----------------
*polpetta* is a script able to initialize a [node.js](http://nodejs.org/) server in any folder you want
`node polpetta ~/path` is basically all you need to start surfing the `~/path` folder as if it is a web-server with the plus that any *file.njs* inside that folder will act as *node.js* module.
Here [the most basic example of an *index.njs* file](https://github.com/WebReflection/polpetta/blob/master/test/index.njs).


Oh Gosh ... Why
---------------
I am maintaining different projects and I am sick of setting up a web-server per each project.
You might have noticed than most recent browsers **do not let us test through the *file://* protocol anymore** and this is the most annoying thing ever for a developer, imho.
With *polpetta* you can create as many server as you want per each folder and test them without setting up a damn thing.
Accordingly, if you develop anything for the web that does not necessary requires this or that server side language, *polpetta* coul dbe exactly what you are looking for.


OK, How Do I Start
------------------
Well, the very first step is to grab *polpetta*, either via `git clone git://github.com/WebReflection/polpetta.git` or simply getting the unique file:

    curl -0 https://raw.github.com/WebReflection/polpetta/master/build/polpetta >polpetta

    # if you want make it executable
    # be sure polpetta firstline points to the right
    # bin folder with node
    chmod +x polpetta

    # if that is the case, test if it runs via
    # and exit via Ctrl+C or simply go to
    # the http://address:port/ showed and start playing
    ./polpetta
