
// simply returns the key if present
function getValue(key, def) {
  return this.hasOwnProperty(key) ?
    this[key] : def
  ;
}