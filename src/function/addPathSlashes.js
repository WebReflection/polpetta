
function addPathSlashes(path) {
  return path.replace(
    PATH_SLASHES, "\\$1"
  );
}