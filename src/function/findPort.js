
function findPort(args) {
  return (/^(\d+)$/.test(args[1]) ||
          /^(\d+)$/.test(args[0])) &&
          RegExp.$1;
}