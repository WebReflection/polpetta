
function createPathReplacer(find, place) {
  var re = RegExp(
    addPathSlashes(find), "g"
  );
  return function (path) {
    return path.replace(
      re, place
    );
  };
}