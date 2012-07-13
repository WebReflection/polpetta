
function getCookie(key, def) {
  return typeof key == "string" ?
    getValue.call(this, key, def) :
    key.__cookie__ || (
      defineImmutableProperties(
        key, {
          __cookie__: defineImmutableProperties(
            [], {
              set: function () {
                this.push(
                  setCookie.apply(null, arguments)
                );
                return this;
              }
            }
          )
        }
      )
    ).__cookie__
  ;
}