
function invokedHtaccess(
  method,
  polpetta,
  request,
  response,
  file,
  ext,
  data
) {
  if (htaccess) {
    event.defaultPrevented = false;
    event.type = method.slice(2);
    event.polpetta = polpetta;
    event.request = request;
    event.response = response;
    event.file = file;
    event.ext = ext;
    event.data = data;
    return htaccess[method](event) === false ||
      event.defaultPrevented === true
    ;
  }
  return false;
}