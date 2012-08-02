
function defineKnownGetter(property, value) {
  return {
    enumerable: true,
    get: function () {
      return defineKnownProperty(
        this,
        property,
        value
      )[property];
    }
  };
}