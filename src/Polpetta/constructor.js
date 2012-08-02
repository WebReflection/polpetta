
function Polpetta(request, response) {

  // immutable properties
  defineKnownProperty(this, "request", request);
  defineKnownProperty(this, "response", response);
  defineKnownProperty(this, "url", url.parse(request.url, true));

  pathname = this.url.pathname;
  this.path = pathname == WEB_SEP ?
    root :
    polpetta_resolve(
      decodeURIComponent(
        pathname
      )
    )
  ;

  if (HIDDEN_FILE.test(pathname)) {
    return forbidden.call(this);
  }

  // request.method switch helper
  ResponseSwitch.call(this);
}

Polpetta.factory = function (request, response) {
  return new Polpetta(request, response);
};

// exports it in case someone would like to use it
freeze(this.Polpetta = Polpetta);