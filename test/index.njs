// looks familiar, uh?
this.onload = function (
  request,  // original request object
  response, // original response object
  polpetta  // polpetta utility object
  // please note that polpetta does nothing
  // until you ask her to, so ... feel free
  // to use these two objects as you want
  // ----------------------------------------
  // P.S. this is a normal node.js module
  //    to work with polpetta you need only
  //    to export the onload method
) {
  // if you want some easy way to go
  // push the output, and flush the content
  polpetta.output.push(
    '<!doctype html>',
    '<html id="', uid, '">',
      '<head>',
        '<title>Hello Polpetta!</title>',
        '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">',
        // you can use relative paths
        '<link type="text/css" rel="stylesheet" href="./js/../css/hello.css"/>',
        // absolute paths from the folder as root
        '<script src="/js/hello.js"></script>',
      '</head>',
      '<body>',
        '<center>',
          'Hello Polpetta!',
          '<br/>',
          // and normal paths from the folder
          '<img src="img/polpetta.png"/>',
        '</center>',
      '</body>',
    '</html>'
  );
  polpetta.output.flush();
  // `polpetta` refers to a spiced polpetta
  // injected as context for the whole
  // response logic
};
var uid = 'id-' + Math.random();