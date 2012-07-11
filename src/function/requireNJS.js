
// used to require .njs files
function requireNJS(
  file,
  output,
  polpetta,
  request,
  response,
  query
) {
  var module, polpettaFake;
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
  module.onload.call(
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
}