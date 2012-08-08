#!/usr/bin/env node

/**
 * ---------------------------------------------------------
 *       (က) Polpetta Chef, he cooks, you test
 * ---------------------------------------------------------
 * @license   Mit Style License
 * @author    Andrea Giammarchi
 * @twitter   WebReflection
 * ---------------------------------------------------------
 * Chef is a non-blocking way to bake one or more polpetta
 * in different folders and different ports at once, e.g.
 *  chef start path [port]
 *  chef stop path [port]
 */

var
  env = process.env,
  fs = require("fs"),
  path = require("path"),
  spawn = require('child_process').spawn,
  args = process.argv.filter(function (value) {
    return this.found ?
      value :
      this.found = ~value.indexOf("chef")
    ;
  }, {}).slice(1),
  dbName = path.join(env.HOME, ".chef"),
  create = fs.existsSync(dbName) || fs.writeFileSync(dbName, "{}", "utf-8"),
  dbStringified = fs.readFileSync(dbName, "utf-8"),
  db = JSON.parse(dbStringified),
  folder = args[1] ? path.resolve(args[1]) : "",
  port = args[2] || "*",
  domain,
  child
;

function perform(magic) {
  domain = db[folder] || (db[folder] = {});
  switch (magic) {
    case "stop":
      if (folder) {
        port != "*" ?
          (port in domain) && kill(port) :
          Object.keys(domain).forEach(kill)
        ;
      } else {
        Object.keys(db).forEach(function ($folder) {
          domain = db[folder = $folder];
          Object.keys(domain).forEach(kill);
        });
      }
      break;
    case "start":
      if (folder) {
        fs.watch(dbName).on("change", function () {
          var out = fs.readFileSync(dbName, "utf-8").replace(dbStringified, "");
          console.log(out);
          if (/:\/\/[^:]+:(\d+)\//.test(out.split(/\r\n|\r|\n/)[0])) {
            domain[RegExp.$1] = child.pid;
          }
          this.close();
          fs.writeFileSync(dbName, JSON.stringify(db), "utf-8");
        });
        port != "*" && perform("stop");
        child = spawn(
          "node", [path.join(__dirname, "polpetta")].concat(args.slice(1)), {
          detached: true,
          stdio: ["ignore", fs.openSync(dbName, 'a'), "ignore"]
        });
        if (port != "*") {
          domain[port] = child.pid;
        }
        child.unref();
        break;
      }
    default:
      console.log([
        "chef start path [port]",
        "chef stop path [port]"
      ].join("\n"));
      break;
  }
}

function kill(port) {
  if (port in domain) {
    try {
      process.kill(domain[port]);
      console.log(
        "killed " + folder + " on port " + port
      );
    } catch(o_O) {}
    delete domain[port];
  }
}

perform(args[0]);
