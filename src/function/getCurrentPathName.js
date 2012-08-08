
function getCurrentPathName(polpetta) {
  var
    dirName = polpetta.url.pathname,
    request_url = polpetta.request.url
  ;
  // dirName should be at the root, right?
  // so if indexOf is 0 then is not
  return request_url.indexOf(dirName) ?
    url.parse(request_url, true).pathname : dirName
  ;
}
