
// entry point for all requestes
function createServer(
  request,
  response
) {
  var
    url = request.url.split("?"),
    query = parseQuery(url.slice(1).join("?")),
    lookingFor = url[0],
    file = polpetta.resolve(
      lookingFor.slice(-1) == "/" ?
        findHome(lookingFor) :
        lookingFor
    ),
    ext = path.extname(file),
    output = []
  ;
  if (request.method == "POST") {
    request.addListener("data", grabChunks.bind(output));
    request.addListener("end", grabChunks.end.bind(
      output,
      file,
      polpetta,
      request,
      response,
      query,
      ext
    ));
  } else {
    fs.stat(
      file,
      fileStats.bind(
        output,
        file,
        polpetta,
        request,
        response,
        query,
        ext
      )
    );
  }
}
