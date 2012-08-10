if (!module.parent) {
  var wru = require("wru");
  // TODO
  // run tests with all arguments
  // test against .chef file
} else {
  this.onload = function (req, res, p) {
    p.output.push("run through node");
    p.output.flush("text/plain");
  };
}