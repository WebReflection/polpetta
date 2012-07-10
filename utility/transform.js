var
  fs = require("fs"),
  content = fs.readFileSync("types", "utf-8"),
  structure = JSON.parse(('{' +
    content.replace(
    /[\r\n]+/g, "\n"
    ).replace(
    /#[^\n]*/gm, ""
    ).replace(
    /\n{2,}/g, "\n"
    ).replace(
    /^([^/]+\/[^\s]+)\s+([^\n]+)/gm, function (m, $1, $2) {
      return '"' + $1 + '":["' + $2.split(" ").join('","') + '"]';
    }
    ).replace(
    /\n/g, ","
    )).slice(0, -1) + '}'
  ),
  EXTENSION_TO_MIME = {},
  key
;
for (key in structure) {
  structure[key].forEach(function (value) {
    EXTENSION_TO_MIME["." + value] = key;
  });
}
fs.writeFileSync(
  "src/EXTENSION_TO_MIME.js",
  "\nconst EXTENSION_TO_MIME = " +
    JSON.stringify(EXTENSION_TO_MIME)
      .replace(/",(\w)/g, '"$1')
      .replace(/,/g, ",\n") +
  ";\n",
  "utf-8"
);