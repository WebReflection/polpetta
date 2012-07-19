
function serveNJS(
  output,
  file,
  polpetta,
  request,
  response,
  client,
  query
) {
  var files, posted;
  if (request.method == "POST") {
    files = output.file;
    posted = querystring.parse(
      output.join("")
    );
    output = [];
  }
  requireNJS(
    file,
    output,
    polpetta,
    request,
    response,
    client,
    query,
    posted,
    files
  );
}