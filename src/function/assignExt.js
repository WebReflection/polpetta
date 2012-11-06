
function assignExt() {
  return defineNotConfigurableProperty(
    this, "ext", path.extname(this.path)
  ).ext;
}
