
var watchedFiles = Object.create(null),
    // prevent prototype hacks
    prefix = '_';

// used to require .njs files
function requireNJS() {
  try {
    var path = this.path,
        prefixedPath = prefix + path,
    // not my fault if require is synchronous ...
        module = require(path);

    if (FORCE_NJS_RELOAD && !watchedFiles[prefixedPath]) {
        console.log('init watch on:', path);
        watchedFiles[prefixedPath] = true;
        // fs.watch seems to be a bit too aggressive with reloading
        // reloads twice when saving once in text editor
        fs.watchFile(path, function(event) {
            console.log('removing from cache:', path);
            if (require.cache.hasOwnProperty(path)) {
                delete require.cache[path];
            }
        });
    }
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
