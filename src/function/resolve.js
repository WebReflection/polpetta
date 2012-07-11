
// see polpetta.resolve
function resolve(src) {
  src = path.resolve(
		path.join(polpetta.root, src)
	);
	// console.log(src);
	// root must be at index 0
  return src.indexOf(polpetta.root) ? "" : src;
}
