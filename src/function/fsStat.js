
function fsStat() {
  fs.stat(
    this.path,
    fileStat.bind(this)
  );
}