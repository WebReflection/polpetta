
// same as polpetta.resolve
function resolve(src) {
  var root = polpetta.root || DIR;
  src = path.resolve(
		path.join(root, src)
	);
  return src.indexOf(root) ? "" : src;
}
