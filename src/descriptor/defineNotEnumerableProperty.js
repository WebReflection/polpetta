
function defineNotEnumerableProperty(self, key, value) {
  commonDescriptor.enumerable = false;
  commonDescriptor.value = value;
  defineProperty(self, key, commonDescriptor);
  commonDescriptor.enumerable = true;
  return self;
}