
function invokedHtaccess(
  code,
  method,
  data
) {
  if (htaccess && method in htaccess) {
    event.defaultPrevented = false;
    event.status = code;
    event.type = method.slice(2);
    event.polpetta = this;
    event.request = this.request;
    event.response = this.response;
    // file or path are alias, file might disappear
    event.file = event.path = this.path;
    event.ext = this.ext;
    event.data = data;
    return htaccess[method](event) === false ||
      event.defaultPrevented === true
    ;
  }
  return false;
}