
function findRoot(args) {
  // nothing has been specified or ...
  return (
    !args.length || (
      // only the port has been specified
      args.length == 1 && HOST_USER_PORT
    ) ?
      CWD : path.resolve(CWD, args[0])
  ) + SEP;
}
