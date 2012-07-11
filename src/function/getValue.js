
// simply returns the key if present
function getValue(key, def) {
  var value = this[key];
  return value == null ? def : value;
}