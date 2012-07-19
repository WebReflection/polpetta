
// search for a valid page to serve
// when the path is not specified
function findHome(p) {
  return p + (findHome.lookFor.filter(
    findHome.filter,
    p
  )[0] || "");
}
findHome.lookFor = [
  "index.njs",
  "index.html",
  "index.htm"
];
findHome.filter = function (main) {
  return this.found || (
    this.found = fs.existsSync(this + main)
  );
};
