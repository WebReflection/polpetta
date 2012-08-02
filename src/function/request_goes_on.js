
function request_goes_on(polpetta, stats) {
  return !invokedHtaccess.call(
    polpetta,
    200,
    "onrequest",
    stats
  );
}
