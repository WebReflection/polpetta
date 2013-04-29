var
  fs = require('fs'),
  cluster = require('cluster'),
  CPUs = require('os').cpus(),
  stats = Object.create(null),
  lastError;

process.on('uncaughtException', function(err) {
  if (err.stack !== lastError) {
    console.error(lastError = err.stack);
    cluster.disconnect();
  }
});

if (cluster.isMaster) {
  CPUs.forEach(cluster.fork.bind(cluster, process.env));
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork(process.env);
  });
} else {
  require('http').createServer(function (req, res) {
    var path = '../LICENSE.txt';
    if (path in stats) {
      stats[path].push(req, res);
    } else {
      stats[path] = [req, res];
      fs.stat(path, notifyAllRequests.bind(path));
    }
  }).listen(8080);
}

function notifyAllRequests(err, fStat) {
  var
    path = '' + this,
    list = stats[path],
    i = 0,
    length = list.length,
    errored = !!err;
  delete stats[path];
  while (i < length) {
    (errored ? errorStaticFile : serveStaticFile).call({
      request: list[i++],
      response: list[i++],
      path: path
    }, err, fStat);
  }
}

function errorStaticFile(err, fStat) {
  response.writeHead(404);
  response.end();
}

function serveStaticFile(err, fStat) {
  var
    response = this.response,
    mtime = fStat.mtime.getTime(),
    requestHeaders = this.request.headers,
    ifNoneMatch = requestHeaders['if-none-match'],
    ifModifiedSince = requestHeaders['if-modified-since'],
    responseHeaders = {
      etag: ''.concat(
        '"',
          // http://httpd.apache.org/docs/2.2/mod/core.html#fileetag
          fStat.ino, '-', fStat.size, '-', mtime,
        '"'
      ),
      'last-modified': fStat.mtime
    },
    stream;

  if ((ifNoneMatch  || ifModifiedSince) &&
    (!ifNoneMatch  || ifNoneMatch === responseHeaders.etag) &&
    (!ifModifiedSince || mtime <= Date.parse(ifModifiedSince))
  ) {
    response.writeHead(304, responseHeaders);
    response.end();
  } else {
    // if runtime gzip assign this later on
    // responseHeaders['content-length'] = fStat.size;
    responseHeaders['content-type'] = 'text/plain';
    response.writeHead(200, responseHeaders);
    stream = fs.createReadStream(this.path);
    // if runtime gzip stream = stream.pipe(gzip/deflate)
    stream.pipe(response);
  }
}