just-args
=========

really, nothing special, just a cleaned up process.argv

    // usage
    var args = require('just-args');

    // C:\\folder\node.exe file.js a b c
    // ~/node/bin/node file.js a b c
    // node file.js a b c
    // ./file.js a b c
    console.log(args); // ['a', 'b', 'c']