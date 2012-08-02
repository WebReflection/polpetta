var
  fs = require("fs"),
  version = require("../build/polpetta").Polpetta.prototype.version,
  pkg = fs.readFileSync("package.json", "utf-8")
;

fs.writeFileSync(
  "package.json",
  pkg.replace(
    /"version": "([^"]+)"/,
    '"version": "' + version + '"'
  ),
  "utf-8"
);
