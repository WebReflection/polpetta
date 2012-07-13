
// used to require .njs files
function requireNJS(
  file,
  output,
  polpetta,
  request,
  response,
  query,
  posted
) {
  var
    hcookie = request.headers.cookie,
    cookie,
    module, polpettaFake
  ;
  try {
    // not my fault if require is synchronous ...
    module = require(file);
  } catch(o_O) {
    return notFound(
      output,
      polpetta,
      response
    );
  }
  keys.forEach(
    setPolpettaValue,
    polpettaFake = {}
  );
  hcookie &&
  hcookie.split(';').forEach(parseCookie, cookie = {});
  module.onload.call(
    defineImmutableProperties(
      polpettaFake, {
        get: getValue.bind(query),
        post: getValue.bind(posted || {}),
        cookie: getValue.bind(cookie),
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
}