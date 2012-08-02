
        var
            setup, teardown, jsc
        ;

        // node, rhino, and web
        try {
            // node and phantom js
            var wru = this.wru || require("./../build/wru.console");
        } catch(wru) {
            // rhino
            try {
                load(
                    new java.io.File(".").getCanonicalPath() + 
                    "/build/wru.console.js"
                );
            } catch(wru) {
                try {
                    // jsc test/test.js
                    load(
                        "build/wru.console.js"
                    );
                    jsc = true;
                } catch(wru) {
                    // html (assuming test.html is used in same folders structure)
                    (function(xhr){
                        xhr.open("get", "./../build/wru.min.js", false);
                        xhr.send(null);
                        Function(xhr.responseText.replace(/var wru=/,"this.wru=")).call(window);
                    }(new XMLHttpRequest));
                }
            }
        }

        wru.test([{
            name: "test that should pass",
            test: function () {
                wru.assert("it passes", 1);
            }
        },{
            name: "async test",
            test: function () {
                if (jsc) {
                    wru.log("JavaScriptCore does not support timers (yet)");
                    wru.assert("OK");
                } else {
                    setTimeout(wru.async(function (arg) {
                        wru.assert("OK", "OK" === arg);
                        wru.assert(setup === 1);
                        wru.assert(teardown == null);
                    }), 2000, "OK");
                }
            },
            setup: function () {
                setup = 1;
            },
            teardown: function () {
                teardown = 1;
            }
        },{
            name: "test that should fail",
            test: function () {
                wru.assert("this passes", true);
                wru.assert("this fails", 0);
            }
        },{
            name: "test that should throw an error",
            test: function () {
                wru.assert("it's an error", 1);
                WTF++;
            }
        },{
            name: "test that should be pass synchronously even if the callback was created via async",
            test: function () {
                function sync() {wru.assert(++executed)}
                var executed = 0;
                jsc ? sync() : wru.async(sync)();
                wru.assert(executed);
            }
        }]);
        