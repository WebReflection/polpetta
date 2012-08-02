
function defineGetter(get) {
  return {
    enumerable: true,
    get: get
  };
}