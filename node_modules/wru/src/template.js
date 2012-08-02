// https://github.com/WebReflection/wru
function wru(wru){var assert=wru.assert,async=wru.async,log=wru.log;

// enojy your tests!



wru.test([
    {
        name: "it works!",
        test: function () {
            // sync
            wru.assert(1);
            
            // async
            setTimeout(async(function () { // wru.async
                assert("called"); // wru.assert
            }), 500);
        }
    }
]);



}





// wru related code
{{JS}}