
// used to require .njs files
function requireNJS() {
  // invalidate the module
  if (FORCE_NJS_RELOAD && require.cache.hasOwnProperty(this.path)) {
    delete require.cache[this.path];
  }
  try {
    // not my fault if require is synchronous ...
    var module = require(this.path);
  } catch(o_O) {
    console.error(o_O);
    return internalServerError.call(this, o_O);
  }
  module.onload(
    this.request,
    this.response,
    this
  );
}
