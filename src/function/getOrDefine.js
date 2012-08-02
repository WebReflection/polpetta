
function getOrDefine(object, key, callback) {
  return has(object, key) ?
    object[key] : object[key] = callback(key)
  ;
}
