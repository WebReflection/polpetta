
// handy function to have only real arguments
// works with env directive or through node ~/program.js
function resolveArguments(args, keepProgramName) {
  // do not modify original argument
  var a = [].slice.call(args, 0);
  // remove first argument if it's node
  if (/(?:^|\/|\\)node(?:\.exe)?$/.test(a[0])) a.shift();
  // remove program itself
  keepProgramName || a.shift();
  return a;
}