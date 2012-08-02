
    wru.log = function (obj, printOnly) {
        try {
            if (printOnly) {
                throw new Error;
            }
            console.log(obj);
        } catch(o_O) {
            log(obj, 0);
        }
    };
