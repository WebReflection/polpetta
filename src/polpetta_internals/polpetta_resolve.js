
// see polpetta_resolve
function polpetta_resolve(src) {
  src = path.resolve(
		root + systemPath(src)
	);
	// root must be at index 0
  return src.indexOf(root) ? "" : src;
}