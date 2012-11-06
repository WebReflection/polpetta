
function withKeysMethod(callback, obj) {
  return defineKnownProperty(
    callback.bind(obj),
    "keys",
    keys.bind(null, obj)
  );
}
