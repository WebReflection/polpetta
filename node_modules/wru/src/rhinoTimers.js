// revisited by Andrea Giammarchi, @WebReflection
// compatible with both Rhino and Node
// now it is possible to include this file in the server console without rhinoTimers dependencies
// @link http://stackoverflow.com/questions/2261705/how-to-run-a-javascript-function-asynchronously-without-using-settimeout
// glory and fortune to to Weston C for the inital hint
// but it's also RIDICULOUS Rhino does not implement in core timers properly!

// condition to avoid problems with jsc
if (typeof global != "undefined") {

    var
        setTimeout = global.setTimeout,
        setInterval = global.setInterval,
        clearInterval = global.clearInterval,
        clearTimeout = global.clearTimeout
    ;

    setTimeout || (function (timer, ids, slice, counter) {

        // did you know?
        //  all browsers but IE accept one or more arguments
        //  to pass to the callbacl after the timer/delay number
        //  ... so does Rhino now!

        setInterval = global.setInterval = function setInterval(fn, delay) {
            return schedule(fn, delay, slice.call(arguments, 2), 1);
        };

        setTimeout = global.setTimeout = function setTimeout(fn, delay) {
            return schedule(fn, delay, slice.call(arguments, 2));
        };

        clearInterval = global.clearInterval =
        clearTimeout = global.clearTimeout = function clearInterval(id) {
            ids[id].cancel();
            timer.purge();
            delete ids[id];
        };

        function schedule(fn, delay, args, interval) {
            var id = ++counter;
            ids[id] = new JavaAdapter(java.util.TimerTask,{run: function () {
                fn.apply(null, args);
            }});
            interval ?
                timer.schedule(ids[id], delay, delay)
                :
                timer.schedule(ids[id], delay)
            ;
            return id;
        }

    })(new java.util.Timer(), {}, [].slice, 0);

} else { // jsc specific hack
    !function (global, i, cbs, slice) {
        function setTimeout(cb, delay) {
            var t = new Date;
            while (new Date - t < delay);
            cb.apply(null, slice.call(arguments, 2));
        }
        slice = cbs.slice;
        global.setTimeout = global.setInterval = setTimeout;
        global.clearInterval = global.clearTimeout = function () {};
    }(this, 0, []);
}
