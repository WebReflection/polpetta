// JS builder by Andrea Giammarchi - mirror of the python one
// Mit Style License
// Note: this is not "extreme performances oriented" JS code
//       it should work on node.js 0.6+
var
  fs = require("fs"),
  exec = require('child_process').exec,
  zlib = require('zlib'),
  args = null
;

function next() {
  args && queue(args);
}

function queue(queue) {
  for (var tmp, i = 0; i < queue.length; ++i) {
    tmp = queue[i];
    if (typeof tmp == "string") console.log(tmp);
    else {
      args = queue.slice(i + 1);
      tmp();
      return;
    }
  }
  args = null;
}

function fullPath(file) {
  file = __dirname + "/" + file;
  while (/([^/.]+)\/\.\.\//.test(file)) {
    file = file.replace(RegExp["$&"], "");
  }
  return file;
}

function getSize(file) {
  var
    i = 0,
    sufix = ['bytes', 'Kb', 'Mb'],
    size = fs.statSync(fullPath(file)).size
  ;
  while (1023.0 < size) {
    size = size / 1024.0;
    i = i + 1;
  }
  return Math.round(size, 2) + ' ' + sufix[i];
}

function read(file) {
  return fs.readFileSync(fullPath(file));
}

function write(file, content) {
  fs.writeFileSync(fullPath(file), content);
}

function replace(content, search, replace) {
  content = content.toString();
  for (var i = 0; i < search.length; ++i) {
    content = content.replace(search[i], replace[i]);
  }
  return content
}

function compile(copyright, fullName, minName, files, search, replace) {
  function onbuild(err, out) {
    write('../' + fullName, content);
    content = read('../' + minName);
    fs.createReadStream(
      fullPath('../' + minName)
    ).pipe(
      tmp = zlib.createGzip()
    ).pipe(
      fs.createWriteStream(
        fullPath('../' + minName + '.gz')
      )
    );
    tmp.on('end', function() {
      console.log('Full size:       ' + getSize('../' + fullName));
      console.log('Minified size:   ' + getSize('../' + minName));
      console.log('Minified size:   ' + getSize('../' + minName + '.gz'));
      exec('rm "' + fullPath('../' + minName + '.gz') + '"', next);
    });
  }
  var
    after = {
      and: function (_) {
        after._ = _;
      }
    },
    multiCopyright = [
      '/*!', copyright, '*/',
      '/**@license ' + copyright, '*/'
    ].join("\n"),
    i, tmp, content, cleanContent
  ;
  files = files.slice();
  for (i = 0; i < files.length; ++i) {
    files[i] = read('../' + 'src/' + files[i]);
  }
  content = multiCopyright + "\n" + files.join("\n");
  files = [];
  search && (content = replace(content, search, replace));
  cleanContent = content.replace(/\/\/\^[^\0]*?\/\/\$[^\n\r]+/);
  write('../' + fullName, cleanContent);
  // YUICompressor
  exec('java -jar "' + fullPath('jar/yuicompressor-2.4.6.jar') + '" --type=js "' + fullPath('../' + fullName) + '" -o "' + fullPath('../'  + minName) + '"', onbuild);
  // Uglify
  // exec('java -jar "' + fullPath('jar/js.jar') + '" "' + fullPath('uglify-js/exec.js') + '" "' + fullPath('uglify-js/uglify.js') + '" "' + fullPath('../' + fullName) + '" "' + copyright + '" > "' + fullPath('../'  + minName) + '"', onbuild);
  // Closure Compiler
  // exec('java -jar "' + fullPath('jar/compiler.jar') + '" --compilation_level=SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT --js "' + fullPath('../' + fullName) + '" --js_output_file "' + fullPath('../'  + minName) + '"', onbuild);
}

this.queue = queue;
this.next = next;
this.fullPath = fullPath;
this.getSize = getSize;
this.read = read;
this.write = write;
this.replace = replace;
this.compile = compile;