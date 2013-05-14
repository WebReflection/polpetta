var
  cluster = require('cluster'),
  mpath = require('path'),
  fs = require('fs'),
  os = require('os'),
  constitution = require('./constitution.js'),
  CPUs = os.cpus().slice(0, constitution.CPU),
  workers = [],
  server = {};

function message(msg) {
  console.log(msg);
}

function createFork() {
  workers.push(
    cluster.fork().on('online', createServer)
  );
}

function createServer() {
  this.send(server);
  this.on('message', message);
}

require('./first-contact.js').connect(function (host, port) {
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
    worker.removeListener('message', message);
    console.warn(
      'worker ' + worker.process.pid +
      ' died (' + worker.process.exitCode + '). restarting...'
    );
    workers.splice(workers.indexOf(worker), 1);
    process.nextTick(createFork);
  });
  CPUs.forEach(createFork);
});