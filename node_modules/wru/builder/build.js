var
  copyright = '(C) Andrea Giammarchi, @WebReflection - Mit Style License',
  JSBuilder = require("./JSBuilder")
;

JSBuilder.queue([
  "",
  "-----------------------",
  "|   wru DOM version   |",
  "-----------------------",
  function () {
    JSBuilder.compile(
        copyright,
        'build/wru.dom.js',
        'build/wru.min.js',
        [
            "wru.intro.js",
            "wru.DOM.functions.js",
            "wru.functions.js",
            "wru.js",
            "wru.variables.js",
            "wru.DOM.variables.js",
            "wru.shared.js",
            "wru.global.shortcuts.js",
            "wru.DOM.node.js",
            "wru.DOM.cursor.js",
            "wru.debug.js",
            "wru.DOM.log.js",
            "wru.outro.js"
        ]
    );
  },
  "----------------------",
  "",
  "",
  "-----------------------",
  "| wru console version |",
  "-----------------------",
  function () {
    JSBuilder.compile(
        copyright,
        'build/wru.console.max.js',
        'build/wru.console.js',
        [
            "rhinoTimers.js",
            "wru.intro.js",
            "wru.console.functions.js",
            "wru.functions.js",
            "wru.js",
            "wru.variables.js",
            "wru.console.variables.js",
            "wru.shared.js",
            "wru.console.log.js",
            "wru.export.js",
            "wru.global.shortcuts.js",
            "wru.console.cursor.js",
            "wru.debug.js",
            "wru.outro.js"
        ]
    );
  },
  function () {
    JSBuilder.write(
      '../build/wru.console.js',
      JSBuilder.replace(
        JSBuilder.read('../build/wru.console.js'),
        [
          /\w+=global.setInterval=/,
          /\w+=global.setTimeout=/,
          /\w+=global.clearInterval=/,
          /\w+=global.clearTimeout=/
        ],
        [
          'setInterval=global.setInterval=',
          'setTimeout=global.setTimeout=',
          'clearInterval=global.clearInterval=',
          'clearTimeout=global.clearTimeout='
        ]
      )
    );
    JSBuilder.next();
  },
  "----------------------",
  "",
  function () {
    JSBuilder.write(
        '../build/template.html',
        JSBuilder.replace(
            JSBuilder.read('../src/template.html'),
            [
                '{{CSS}}',
                '{{JS}}',
                'var wru=',
                '}(this);'
            ],
            [
                JSBuilder.read('../src/template.css'),
                JSBuilder.read('../build/wru.min.js'),
                'wru(',
                '}(this));'
            ]
        )
    );
    JSBuilder.next();
  },
  function () {
    JSBuilder.write(
        '../build/template.js',
        JSBuilder.replace(
            JSBuilder.read('../src/template.js'),
            [
                '{{JS}}',
                'var wru=',
                '}(this);'
            ],
            [
                JSBuilder.read('../build/wru.console.js'),
                'wru(',
                '}(this));'
            ]
        )
    );
    JSBuilder.next();
  },
  function () {
    JSBuilder.write(
        '../build/template.phantom.js',
        'var page=new WebPage;page.open(phantom.args[0]||"about:blank",function(){page.evaluate(function(){' + JSBuilder.replace(
            JSBuilder.read('../src/template.js'),
            [
                '{{JS}}',
                'var wru=',
                '}(this);'
            ],
            [
                'window.phantomExit=false;window.quit=function(){window.phantomExit=true};window.require=function(){return{wru:window.wru}};window.global=window;\n' + JSBuilder.read('../build/wru.console.js'),
                'wru(',
                '}(this));'
            ]
        ) + '\n});page.onConsoleMessage=function(msg){if (!/^\s+(?:\\\\|\\/|\\||\\-)/.test(msg))console.log(msg.replace("\\n",""))};setInterval(function(){page.evaluate(function(){return window.phantomExit})&&phantom.exit()})});'
    );
    JSBuilder.next();
  },
  function () {
    JSBuilder.write(
        '../node/wru.console.js',
        JSBuilder.read('../build/wru.console.js')
    );
    JSBuilder.next();
  },
  function () {
    require('child_process').exec('cp build/wru.console.js node/wru.console.js', JSBuilder.next);
  },
  "done"
]);