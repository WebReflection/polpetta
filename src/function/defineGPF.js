
function defineGPF(self, property, bound) {
  return defineKnownProperty(
    self,
    property,
    withKeysMethod(
      getValue,
      bound
    )
  )[property];
}