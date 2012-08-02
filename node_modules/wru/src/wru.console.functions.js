    // console specific version
    function isGonnaBeLegen() {
        current = shift.call(queue);
        if (current) {
            if (typeof current == "function") {
                current = {name: current[NAME] || "anonymous", test: current};
            }
            log(OUTPUT_SEPARATOR);
            log(
                (iHasIt(current, NAME) && current[NAME])
                ||
                (iHasIt(current, DESCRIPTION) && current[DESCRIPTION])
                ||
                UNKNOWN
            );
            pass = [];
            fail = [];
            fatal = [];
            tmp = {};
            giveItATry("setup");
            fatal[LENGTH] || giveItATry("test");
            waitForIt || Dary();
        } else {
            showSummary();
        }
    }
    
    function log(info, avoidNewLine) {
        info = info + (avoidNewLine ? "" : "\n");
        try {
            // node 0.6
            require("util").print(info);
        } catch(up) {
            try {
                // node 0.4
                require("sys").print(info);
            } catch(up) {
                try {
                    // hello Rhino
                    // print uses println ... while we need print without \n
                    java.lang.System.out.print(info);
                } catch(up) {
                    try {
                        // phantomjs or default fallback
                        console.log(info);
                    } catch(up) {
                        // jsc and others
                        print(info);
                    }
                }
            }
        }
    }
    
    function showSummary() {
        log(EMPTY);
        log(OUTPUT_SEPARATOR);
        switch (true) {
            case !!overallFatal:
                log(ERROR + "   " + overallFatal + " Errors");
            case !!overallFail:
                log(FAILURE + EMPTY + overallFail + " Failures");
            default:
                log(OK + "      " + overallPass + " Passes");
        }
        log(OUTPUT_SEPARATOR);
        log(EMPTY);
        try {
            // node.js
            process.exit();
        } catch(up) {
            // rhino
            quit();
        }
    }
    
    function writeItOrdered(fail) {
        for (var
            i = 0, length = fail[LENGTH];
            i < length;
            log("    " + (++i) + ". " + fail[i - 1])
        );
    }
    
    function Dary() {
        clearDaryTimeou();
        overallPass += pass[LENGTH];
        overallFail += fail[LENGTH];
        overallFatal += fatal[LENGTH];
        if (fatal[LENGTH]) {
            prefix = ERROR;
            writeItOrdered(fatal);
        } else if(fail[LENGTH]) {
            prefix = FAILURE;
            writeItOrdered(fail);
        } else {
            prefix = OK;
        }
        log(prefix + " passes: " + pass[LENGTH] + ", fails: " + fail[LENGTH] + ", errors: " + fatal[LENGTH]);
        ci = 0;
        prefix = EMPTY;
        isGonnaBeLegen();
    }
    