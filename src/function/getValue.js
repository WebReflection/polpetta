
// simply returns the key if present
function getValue(key, def) {
  return has(this, key) ?
    this[key] : def
  ;
}