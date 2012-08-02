
    wru.log = function log(obj, alertOnly) {
        alertOnly ?
            alert(obj) :
            (typeof console != "undefined") && console.log(obj)
        ;
    };
