
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
    polpettaFake = {},
    output = [],
    required
  ;
  keys.forEach(
    setPolpettaValue,
    polpettaFake
  );
  if (ext == ".njs") {
    // the case where an .njs file should be invoked
    try {
      // not my fault if require is synchronous ...
      required = require(file);
    } catch(o_O) {
      notFound(
        output,
        polpetta,
        response
      );
    }
    required.onload.call(
      defineImmutableProperties(
        polpettaFake, {
          get: getValue.bind(query),
          output: defineImmutableProperties(
            output, {
              flush: flushResponse.bind(
                output,
                polpetta,
                response
              )
            }
          )
        }
      ),
      request,
      response
    );
  } else if (file) {
    // the case where a generic file should be served
    fs.exists(
      file,
      fileExists.bind(
        output,
        file,
        polpetta,
        response,
        ext
      )
    );
  } else {
    // the other case, the WTF one ...
    notFound(
      output,
      polpetta,
      response
    );
  }
}
