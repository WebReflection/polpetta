
function polpetta_redirect(href, internally) {
  if (internally) {
    has(this, "url") ||
    defineKnownProperty(this, "url", url.parse(href, true));
  } else {
    redirect.Location = href;
    this.response.writeHead(
      301, redirect
    );
    this.response.end();
    return false;
  }
}