
function defineKnownProperty(self, key, value) {
  commonDescriptor.value = value;
  return defineProperty(self, key, commonDescriptor);
}
