var
  constitution = require('./constitution.js'),
  firstContact = require('./first-contact.js'),
  cluster = require('cluster'),
  sPath = require('path'),
  fs = require('fs'),
  os = require('os'),
  stat = Object.create(null),
  CPUs = os.cpus(),
  workers = [],
  server = {};

function createFork() {
  var worker = cluster.fork();
  workers.push(worker);
  worker.on('online', createServer);
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
}

function FileInfo(path, err, stat) {
  this.path = path;
  this.error = err;
  this.stat = stat;
}
FileInfo.prototype.toString = function toString() {
  return this.path;
};

function dirListing(path, fStat, err, files) {
  var length;
  switch(!err) {
    case true:
      length = files.length;
      files.forEach(function (file, i, files) {
        fs.stat(file, function (err, fStat) {
          files[i] = new FileInfo(
            sPath.join(path, file), err, fStat
          );
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