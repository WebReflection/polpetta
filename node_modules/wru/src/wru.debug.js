    
    //^ this is useful to test internals on non minified version
    wru.debug = function (O_o) {
        return eval("(" + O_o + ")");
    };
    //$ and this block is removed at build time
    