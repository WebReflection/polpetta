// looks familiar, uh?
this.onload = function (
  request,  // original request object
  response  // original response object
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
  this.output.push(
    '<!doctype html>',
    '<html>',
      '<head>',
        '<title>Hello Polpetta!</title>',
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
          '<img src="img/meatball.jpg"/>',
        '</cener>',
      '</body>',
    '</html>'
  );
  this.output.flush();
  // `this` refers to a spiced polpetta
  // injected as context for the whole
  // response logic
};
