var
  cluster = require('cluster'),
  http = require('http'),
  server;

function uncaughtException(err) {
  process.removeListener(
    'uncaughtException',
    uncaughtException
  );
  console.error(err.stack);
  cluster.worker.kill();
}

function serverListener() {
  process.send('I am ready');
}

function message(msg) {
  console.log('I am worker');
  console.log(msg);
}

process.on('uncaughtException', uncaughtException);

process.on('message', function firstMessage(evt) {
  process.removeListener('message', firstMessage);
  process.on('message', message);
  server = http.createServer(serverListener).listen(evt.port, evt.host);
});