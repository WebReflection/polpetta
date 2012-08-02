    
    var // wru library core
        wru = {
            assert: function assert(description, result) {
                
                // if no description provided, variables are shifted
                // these are both valid wru.assert calls indeed
                // wru.assert(truishValue);
                // wru.assert("test description", truishValue);
                if (arguments[LENGTH] == 1) {
                    result = description;
                    description = UNKNOWN;
                }
                
                // flag used in wru.async to verify at least
                // one assertion was performed
                called = TRUE;
                
                // store the result in the right collection
                push.call(result ? pass : fail, prefix + description);
                
                // just to add a bit of sugar
                return result;
            },
            async: function async(description, callback, timeout, p) {
                
                // p is used as sentinel
                // it defines the anonymous name
                // if necessary and it's used to flag the timeout
                p = ++waitForIt;
                
                // if no description provided, variables are shifted
                // these are all valid wru.async calls indeed, timeout is optional
                // wru.async(function () { ... })
                // wru.async("test description", function () { ... })
                // wru.async(function () { ... }, timeout)
                // wru.async("test description", function () { ... }, timeout)
                if (typeof description == "function") {
                    timeout = callback;
                    callback = description;
                    description = "asynchronous test #" + p;
                }
                
                // if in *TIMEOUT* time nothing happens ...
                timeout = setTimeout(function () {
                    
                    // p is flagged as 0
                    p = 0;
                    
                    // timeout is handled as failure, not error (could be the server)
                    push.call(fail, description);
                    
                    // if there is no reason to waitForIt then is time to call Dary()
                    --waitForIt || (daryTimeout = setTimeout(Dary, 0));
                },
                    // timeout can be specified
                    // this procedure ensure that it's
                    // a number and it's greater than 0
                    abs(timeout || TIMEOUT) || TIMEOUT
                );
                
                // the async function is a wrap of the passed callback
                return function async() {
                    
                    // if it's executed after the timeout nothing happens
                    // since the failure has been already notified
                    if (!p) return;
                    
                    // called is always set as *TRUE* during any assertion
                    // this indicates if the callback made at least one assertion
                    // as example, in this case the callback could be called many time
                    // with different readyState ... however, only on readyState 4
                    // there is the assertion we are interested about, e.g.
                    // 
                    // xhr.onreadystatechange = wru.async(function (){
                    //      if (this.readyState == 4)
                    //          wru.assert("content", this.responseText.length)
                    //      ;
                    // });
                    // 
                    // in above example called will be flagged as true
                    // only during last readyState call
                    called = FALSE;
                    
                    // simply recycled "string" variable
                    // prefix will be internally used by assert during function execution
                    prefix = description + ": ";
                    
                    // the original callback is called with proper *this* if specified
                    try {
                        callback.apply(this, arguments);
                    } catch(doooodeThisIsBAD) {
                        // if there is an Error
                        // the test is screwed up
                        // called has to be set as *TRUE* to invalidate the test
                        called = TRUE;
                        // message is "casted" to avoid IE host objects errors problem
                        // (or any other possible edge case)
                        push.call(fatal, prefix + doooodeThisIsBAD);
                    }
                    
                    // prefix can be *EMPTY* string again now
                    prefix = EMPTY;
                    
                    // a failure or at least an assertion
                    if (called) {
                        
                        // timeout not necessary anymore
                        clearTimeout(timeout);
                        
                        // if there is no reason to waitForIt then is time to call Dary()
                        --waitForIt || (daryTimeout = setTimeout(Dary, 0));
                    }
                };
            },
            
            // wru.test({...test...})
            // wru.test([{...test...}, {...test...}, ...])
            // the {...test...} object should have a string name and a function test property
            // optionally a function setup and a function teardown too
            test: function test(list) {
                
                // test may be called multiple times
                // queue should simply concatenate other calls
                queue = concat.apply(queue, [list]);
                
                // if wru.random is true, the queue is ranodomized
                // this is to make tests indipendent from each others
                wru.random && sort.call(queue, messItUp);
                
                // if there is no test to waitForIt
                // Dary() has been called already
                // we can procede with next test
                // invoking isGonnaBeLegen()
                waitForIt || isGonnaBeLegen();
            }
        },
        