
function findHost(args) {
  var
    reHost = /^(.+?)\:(\d+)$/
  ;
  return (reHost.test(args[1]) ||
          reHost.test(args[0])) &&
          RegExp.$1;
}