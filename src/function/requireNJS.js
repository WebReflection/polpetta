
// used to require .njs files
function requireNJS(
  file,
  output,
  polpetta,
  request,
  response,
  client,
  query,
  posted,
  files
) {
  var
    hcookie = request.headers.cookie,
    cookie = {},
    cookies = [],
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
  polpettaKeys.forEach(
    setPolpettaValue,
    polpettaFake = {}
  );
  posted || (posted = {});
  files || (files = {});
  hcookie &&
  hcookie.split(/(?:,|;) /).forEach(parseCookie, cookie);
  polpettaFake = defineImmutableProperties(
    polpettaFake, {
      get: getValue.bind(query),
      post: getValue.bind(posted),
      cookie: cookieManager.bind(cookie),
      file: getValue.bind(files),
      url: client,
      output: defineImmutableProperties(
        output, {
          flush: flushResponse.bind(
            output,
            polpetta,
            response,
            cookies
          )
        }
      )
    }
  );
  polpettaFake.get.keys = keys.bind(null, query);
  polpettaFake.post.keys = keys.bind(null, posted);
  polpettaFake.file.keys = keys.bind(null, files);
  polpettaFake.cookie.keys = keys.bind(null, cookie);
  polpettaFake.cookie.set = cookieManager.set.bind(cookies);
  module.onload.call(
    polpettaFake,
    request,
    response
  );
}