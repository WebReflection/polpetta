function onload(req, res, p) {
  function createCommonTest(name) {
    return {
      name: name,
      test: function () {
        var calls = 2;
        wru.assert(name + " has 2 keys", p[name].keys().length == 2);
        p[name].keys().forEach(function (key, i) {
          if (i) {
            wru.assert("key is 'second'",
              key == "second");
            wru.assert(name + ".key('" + key + "') is a string",
              typeof p[name](key) == "string");
            wru.assert(name + ".key('" + key + "') is '" + polpetta +"'",
              p[name](key) == polpetta);
            calls += 3;
          } else {
            wru.assert("key is 'first'", key == "first");
            if (name == "cookie") {
              wru.assert(name + ".key('" + key + "') is a string",
                typeof p[name](key) == "string");
              wru.assert(
                name + ".key('" + key + "') is " + logo + "2",
                  p[name](key) == logo + "2"
              );
              calls += 2;
            } else {
              wru.assert(name + ".key('" + key + "')[0] is an array",
                Array.isArray(p[name](key)));
              wru.assert(
                name + ".key('" + key + "')[0] is " +
                "['" + logo + "1', '" + logo + "2']",
                  p[name](key)[0] == logo + "1" &&
                  p[name](key)[1] == logo + "2"
              );
              calls += 2;
            }
            calls += 1;
          }
        });
        wru.assert("expected 8 calls", calls == 8);
      }
    };
  }
  wru.output = p.output;
  if (!/\/unit\.njs$/.test(req.url)) {
    wru.test([
      function onload() {
        wru.onOnload = wru.async(function () {
          wru.assert("onload called", true);
          wru.assert("no error found", !wru.writtenHead);
        });
      },
      function request() {
        wru.assert("request is request", p.request === req);
      },
      function response() {
        wru.assert("response is response", p.response === res);
      },
      createCommonTest("get"),
      createCommonTest("cookie")
    ].concat(extras));
  } else {
    p.output.push("TODO: create HTML form to test this stuff");
    p.output.flush("txt");
  }
}

var
  Polpetta = require("../build/polpetta").Polpetta,
  wru = require("wru"),
  logo = "(က) ",
  polpetta = logo + "Polpetta",
  commonData = [
    "first=" + logo + "1",
    "first=" + logo + "2",
    "second=" + polpetta
  ],
  request = {
    method: "GET", // TODO simulte POST and send files as well (test all at once)
    url: "/test/unit.njs?" + encodeURI(commonData.join("&")),
    headers: {
      cookie: commonData.join(", ").replace(
        /(\w+=)([^&,]+)/g,
        function (m, $1, $2) {
          return $1 + escape($2);
        }
      )
    }
  },
  response = {
    writeHead: function () {
      wru.writtenHead = arguments;
      if (wru.onWrittenHead) wru.onWrittenHead();
    },
    end: function () {
      wru.ended = arguments;
    }
  },
  extras = [
    function forbidden() {
      request.url = "/.htaccess";
      var p = new Polpetta(request, response);
      wru.assert("Status-Code is 403", wru.writtenHead[0] === 403);
      wru.assert("Connection closed", wru.writtenHead[1]["Connection"] === "close");
      wru.assert("Status-Code", wru.writtenHead[1]["Status-Code"] === wru.writtenHead[0]);
      wru.assert("no output", !p.output.length);
    },
    function hidden_node_modules() {
      request.url = "/node_modules";
      var p = new Polpetta(request, response);
      wru.assert("Status-Code is 403", wru.writtenHead[0] === 403);
      wru.assert("Connection closed", wru.writtenHead[1]["Connection"] === "close");
      wru.assert("Status-Code", wru.writtenHead[1]["Status-Code"] === wru.writtenHead[0]);
      wru.assert("no output", !p.output.length);
    },
    function not_found() {
      request.url = "/not.found";
      var p = new Polpetta(request, response);
      wru.onWrittenHead = wru.async(function () {
        wru.assert("Status-Code is 404", wru.writtenHead[0] === 404);
        wru.assert("Connection closed", wru.writtenHead[1]["Connection"] === "close");
        wru.assert("Status-Code", wru.writtenHead[1]["Status-Code"] === wru.writtenHead[0]);
        wru.assert("no output", !p.output.length);
      });
    }
  ]
;

global.wru = wru;
if (!module.parent) {
  wru.random = true;
  onload(request, response, new Polpetta(request, response), extras);
  this.onload = function() {
    wru.onOnload();
  };
} else {
  // light ad-hoc shim
  wru = {
    async: function (callback) {
      return setTimeout(callback, 250);
    },
    test: function (list) {
      wru.errors = [];
      list.forEach(function (test) {
        wru.current = test.name;
        typeof test == "function" ?
          test() : test.test()
        ;
      });
      wru.output.push(wru.errors.join("\n"));
      if (!wru.errors.length) {
        wru.output.push("OK");
      }
      wru.output.flush("txt");
    },
    assert: function (description, result) {
      if (!result) {
        wru.errors.push("[" + wru.current + "] " + description);
      }
    }
  };
  this.onload = onload;
}