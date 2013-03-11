
// used to require .njs files
function requireNJS() {
  try {
    var module = ru(this.path);
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
