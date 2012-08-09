
function findPort(args) {
  return (/^(\d+)$/.test(args[0]) ||
          /^(\d+)$/.test(args[1])) &&
          RegExp.$1;
}