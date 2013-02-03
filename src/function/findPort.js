
function findPort(args) {
  var
    reNum = /^(\d+)$/,
    rePort = /^.+?\:(\d+)$/
  ;
  return (reNum.test(args[1]) ||
          rePort.test(args[1]) ||
          reNum.test(args[0]) ||
          rePort.test(args[0])) &&
          RegExp.$1;
}