
function addPathSlashes(path) {
  return path.replace(
    /(\\|\/)/g, "\\$1"
  );
}