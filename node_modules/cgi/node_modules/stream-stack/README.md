node-stream-stack
=================
### Filter low-level `Stream` instances into stackable, protocol-based streams.

This module exposes the `StreamStack` interface, which starts off as a node
`Stream` subclass that accepts a "parent" Stream to work with. `StreamStack` is
meant to be subclassed in order to implement the layers of a protocol, or run the
parent Stream's data through some kind of filter (i.e. compression).

By default, a `StreamStack` instance proxies all events downstream (from the
parent stream to the child stream), and proxies all functions calls upstream
(from the child stream to the parent stream).

Keeping the `StreamStack` subclass' implementation independent of the parent
`Stream` instance allows for the backend transport to be easily swapped out
for flexibility and code re-use. For example, storing `netcat` results to a file,
and using `fs.ReadStream` as your parent stream, rather than `net.Stream`, in your
test cases.

Since `StreamStack` inherits from the regular node `Stream`, all it's prototypal
goodies can be used along with your subclass instances. This makes it extremely
easy for you to call `Stream#pipe(writable)`, in order to utilize node's data
transfer philosophies.


A Simple Example
----------------

Here's a simple, kinda silly example:

``` js
var util = require('util');
var StreamStack = require('stream-stack').StreamStack;

// The first argument is the parent stream
function DoubleWrite(stream) {
  StreamStack.call(this, stream);
}
util.inherits(DoubleWrite, StreamStack);

// Overwrite the default `write()` function to call
// write() on the parent stream twice!
DoubleWrite.prototype.write = function(data) {
  this.stream.write(data);
  this.stream.write(data);
}


// How to Use:
var doubleStdout = new DoubleWrite(process.stdout);
doubleStdout.write("this will be printed twice!\n");
```

We've defined a `DoubleWrite` class. It accepts a writable stream, and
whenever `write()` is called on the DoubleWrite instance, then in return
`write()` get called _twice_ on the parent stream. In this example, our
writable stream, `process.stdout`, will get the string printed to it twice.


Known Subclasses
----------------

Check out the [Wiki][] page to see the list of [Known Subclasses][Wiki].

[Wiki]: https://github.com/TooTallNate/node-stream-stack/wiki
