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
 *  chef [start|stop] [polpetta|serverdir] [path] [port]
 */

var
  keys = Object.keys,
  env = process.env,
  fs = require("fs"),
  path = require("path"),
  spawn = require('child_process').spawn,
  args = resolveArguments(process.argv),
  dbName = path.join(env.HOME, ".chef"),
  program = /^polpetta|serverdir$/.test(args[1]) ?
    RegExp["$&"] : args.splice(1, 0, "polpetta") && args[1]
  ,
  port = findPort(args.slice(2)) || "",
  filteredFolder = args.filter(function (folder, i) {
    return 1 < i && folder != port;
  })[0],
  folder = path.resolve(filteredFolder || process.cwd()),
  dbStringified, db,
  nmsp, domain, child
;

function perform(magic) {
  domain = nmsp[folder] || (nmsp[folder] = {});
  switch (magic) {
    case "stop":
    case "burn":
      if (filteredFolder) {
        port ?
          kill(port) :
          keys(domain).forEach(kill)
        ;
      } else {
        keys(nmsp).forEach(function ($folder) {
          domain = nmsp[folder = $folder];
          (port ?
            keys(domain).filter(byPort) :
            keys(domain)
          ).forEach(kill);
        });
      }
      keys(nmsp).forEach(clean);
      save();
      break;
    case "start":
    case "cook":
      port && filteredFolder && kill(port);
      child = spawn(
        "node", [path.join(__dirname, program)].concat(args.slice(2)), {
        detached: true,
        stdio: ["ignore", fs.openSync(dbName, "a"), "ignore"]
      });
      port && (domain[port] = child.pid);
      child.unref();
      // watch is not stable yet in Windows
      // here a manual, greedy, watch replacement
      process.nextTick(watchReplacer);
      break;
    default:
      console.log([
        "chef [start|stop] [polpetta|serverdir] [path] [port]"
      ].join("\n"));
      break;
  }
}

function byPort(key) {
  return key === port;
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

function clean(key) {
  if (!keys(nmsp[key]).length) {
    delete nmsp[key];
  }
}

function save() {
  fs.writeFileSync(
    dbName, dbStringified = JSON.stringify(db), "utf-8"
  );
}

function watchReplacer() {
  var out = fs.readFileSync(dbName, "utf-8");
  if (out !== dbStringified) {
    out = out.replace(dbStringified, "");
    console.log(out);
    if (/:\/\/[^:]+:(\d+)\//.test(out.split(/\r\n|\r|\n/)[0])) {
      domain[RegExp.$1] = child.pid;
    }
    save();
  } else {
    process.nextTick(watchReplacer);
  }
}

if (fs.existsSync(dbName)) {
  dbStringified = fs.readFileSync(dbName, "utf-8");
  try {
    db = JSON.parse(dbStringified);
  } catch(o_O) {
    console.warn("ooops, the chef burned something!");
    console.warn(dbStringified);
  }
}

db || save(db = {});
nmsp = db[program] || (db[program] = {});

perform(args[0]);
