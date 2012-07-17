
function cookieManager(key, def) {
  return getValue.call(this, key, def);
}

cookieManager.set = function (key, value) {
  this.push(
    setCookie.apply(null, arguments)
  );
};