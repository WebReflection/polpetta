var
  constitution = require('./constitution.js'),
  firstContact = require('./first-contact.js'),
  cluster = require('cluster'),
  sPath = require('path'),
  fs = require('fs'),
  os = require('os'),
  stat = Object.create(null),
  CPUs = os.cpus().slice(0, constitution.CPU),
  workers = [],
  server = {};

function createFork() {
  workers.push(
    cluster.fork().on('online', createServer)
  );
}

function createServer() {
  this.send(server);
  this.on('message', grabStat);
}

function grabStat(path) {
  if (path in stat) {
    stat[path].push(this);
  } else {
    stat[path] = [this];
    fs.stat(path, fileStat.bind(null, path));
  }
}

function notify(path, fStat, err, files) {
  var list = stat[path];
  delete stat[path];
  list.forEach(notifyWorker, {
    path: path,
    error: err,
    files: files,
    stat: fStat
  });
  if (constitution.SHOW_MEMORY_USAGE) {
    console.log('\033[F\033[F' + os.freemem() + '\n' + os.totalmem());
  }
}

function dirListing(path, fStat, err, files) {
  var length;
  switch(!err) {
    case true:
      length = files.length;
      files.forEach(function (file, i, files) {
        var fullPath = sPath.join(path, file);
        fs.stat(fullPath, function (err, fStat) {
          files[i] = {
            fullPath: fullPath,
            path: file,
            error: err,
            stat: fStat,
            isDirectory: fStat.isDirectory()
            /*,
            isFile: fStat.isFile(),
            isBlockDevice: fStat.isBlockDevice(),
            isCharacterDevice: fStat.isCharacterDevice(),
            //isSymbolicLink: fStat.isSymbolicLink(),
            isFIFO: fStat.isFIFO(),
            isSocket: fStat.isSocket()
            */
          };
          if (!--length) notify(path, fStat, err, files);
        });
      });
    case false:
      if (!length) notify(path, fStat, err, files);
      break;
  }
}

function fileStat(path, err, fStat) {
  var
    notAnError = !err,
    isFile = notAnError && fStat.isFile(),
    isDir = notAnError && !isFile && fStat.isDirectory();
  if (isDir) { // check if dir listing is allowed, forbidden if not!
    switch (constitution.DIRECTORY_LISTING) {
      case 0:
        notify(path, fStat, {stack:'forbidden', satus:403}, null);
        break;
      case 1:
        fs.readdir(
          path,
          notify.bind(null, path, fStat)
        );
        break;
      case 2:
        fs.readdir(
          path,
          dirListing.bind(null, path, fStat)
        );
        break;
    }
  } else {
    notify(path, fStat, err, null);
  }
}

function notifyWorker(worker) {
  worker.send(this);
}

firstContact.connect(function (host, port) {
  if (constitution.SHOW_MEMORY_USAGE) {
    console.log('\n');
  }
  server.host = host;
  server.port = port;
  process.setMaxListeners(3 * CPUs.length);
  process.on('uncaughtException', function (err) {
    console.error(err.stack);
    process.exit(1);
  });
  cluster.on('exit', function(worker, code, signal) {
    worker.removeListener('message', grabStat);
    console.warn(
      'worker ' + worker.process.pid +
      ' died (' + worker.process.exitCode + '). restarting...'
    );
    workers.splice(workers.indexOf(worker), 1);
    process.nextTick(createFork);
  });
  CPUs.forEach(createFork);
});