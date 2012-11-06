
var has = function (hasOwnProperty) {
  return function has(object, key) {
    return hasOwnProperty.call(object, key);
  };
}({}.hasOwnProperty);
