
// used to define generic immutable properties
function defineImmutableProperties(object, properties) {
  defineImmutableProperties.properties = properties;
  defineImmutableProperties.object = object;
  keys(properties).forEach(
    defineImmutableProperties.forEach,
    defineImmutableProperties
  );
  return object;
}

// one bject to rule them all
defineImmutableProperties.descriptor = {
  value: null,
  writable: false,
  enumerable: true,
  configurable: false
};

// one function to rule them all
defineImmutableProperties.forEach = function (key) {
  this.descriptor.value = this.properties[key];
  Object.defineProperty(
    this.object,
    key,
    this.descriptor
  );
};
