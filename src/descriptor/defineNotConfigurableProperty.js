
function defineNotConfigurableProperty(self, key, value) {
  commonDescriptor.writable = true;
  commonDescriptor.value = value;
  defineProperty(self, key, commonDescriptor);
  commonDescriptor.writable = false;
  return self;
}
