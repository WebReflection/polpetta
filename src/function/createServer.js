
// entry point for all requestes
function createServer(
  request,
  response
) {
  var
    client = url.parse(request.url, true),
    query = client.query,
    pathname = client.pathname,
    file = pathname == "/" ?
      polpetta.root :
      polpetta.resolve(
        decodeURIComponent(
          pathname
        )
      )
    ,
    ext = path.extname(file),
    output = [],
    contentType = request.headers["content-type"] || "",
    boundary
  ;
  if (request.method == "POST") {
    if (~contentType.indexOf("multipart/form-data;")) {
      boundary = /boundary=([^;]+)/.exec(contentType)[1];
      request.setEncoding("binary");
    }
    request.addListener("data", grabChunks.bind(output));
    request.addListener("end", grabChunks.end.bind(
      output,
      boundary,
      file,
      polpetta,
      request,
      response,
      client,
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
        client,
        query,
        ext
      )
    );
  }
}
