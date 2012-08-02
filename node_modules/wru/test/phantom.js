var page = new WebPage;

page.onConsoleMessage = function(msg) {
  // cursor removed from phantomjs
  if (!/^\s+(?:\\|\/|\||\-)/.test(msg)) {
    console.log(msg.replace("\n", ""));
  }
};

page.open(phantom.args[0] || "about:blank", function(status) {
  if (status === "success") {
    page.evaluate(function () {
      window.phantomExit = false;
      window.quit = function () {
        window.phantomExit = true;
      };
      window.require = function () {
        return {wru: window.wru};
      };
      window.global = window;
    });
    page.injectJs("../build/wru.console.js");
    page.injectJs("test.js");
  } else {
    phantom.exit(1);
  }
  setInterval(function () {
    page.evaluate(function () {
      return window.phantomExit;
    }) && phantom.exit();
  }, 50);
});