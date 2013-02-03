
function Polpetta(request, response) {

  var url = request.url;

  // immutable properties
  defineKnownProperty(this, "request", request);
  defineKnownProperty(this, "response", response);

  if (!invokedHtaccess.call(
    this,
    0,
    "onrequest",
    url
  )) {
    polpetta_redirect.call(this, url, true);
    pathname = this.url.pathname;
    defineNotConfigurableProperty(
      this, "path",
      pathname == WEB_SEP ?
        root :
        polpetta_resolve(
          decodeURIComponent(
            pathname
          )
        )
    );

    /* check url and resulting path
    console.log(url);
    console.log(pathname);
    console.log(this.path);
    //*/

    if (HIDDEN_FILE.test(pathname)) {
      return forbidden.call(this, stats);
    }

    // request.method switch helper
    ResponseSwitch.call(this);
  }

}

Polpetta.factory = function (request, response) {
  return new Polpetta(request, response);
};

// exports it in case someone would like to use it
freeze(this.Polpetta = Polpetta);
