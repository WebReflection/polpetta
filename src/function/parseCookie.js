
// parses cookies
function parseCookie(cookie) {
  var parts = cookie.split('=');
  this[unescape(parts[0])] = unescape(parts[1] || '');
}