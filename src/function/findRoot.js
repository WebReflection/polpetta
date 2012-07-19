
function findRoot(args) {
  // only the port has been specified
  if (
    // nothing has been specified
    !args.length || (
      // only the port has been specified
      args.length == 1 && HOST_USER_PORT
    )
  ) {
    return CWD;
  }
  return path.resolve(
    CWD, args[0]
  );
}
