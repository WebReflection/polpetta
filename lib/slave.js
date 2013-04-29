var
  cluster = require('cluster'),
  http = require('http'),
  zlib = require('zlib'),
  url = require("url"),
  fs = require('fs'),
  constitution = require('./constitution.js'),
  guardian = require('./guardian.js'),
  firstContact = require('./first-contact.js'),
  requireUpdated = constitution.FORCE_NJS_RELOAD ?
    require('require-updated') : require,
  contentEncoding_re = /\b(deflate|gzip)\b/,
  alwaysEncode = /\.(txt|css|js|html|xml|md|csv)$/,
  rangeTest = /bytes=(\d+)-(\d*)/,
  stat = Object.create(null),
  redirect = {
    Location: null
  },
  server;

function contentEncoding(acceptEncoding) {
  return contentEncoding_re.test(acceptEncoding) ? RegExp.$1 : '';
}

function uncaughtException(err) {
  process.removeListener(
    'uncaughtException',
    uncaughtException
  );
  console.error(err.stack);
  cluster.worker.kill();
}

function serveDir(path, evt, request, response) {
  if (request.url.slice(-guardian.sep.length) !== guardian.sep) {
    redirect.Location = request.url + guardian.sep;
    response.writeHead(301, redirect);
    response.end();
  } else {
    response.writeHead(200);
    response.end(evt.files.join('\n'));
  }
}

function serveStaticFile(path, evt, request, response) {
  var
    stat = evt.stat,
    mtime = new Date(stat.mtime),
    requestHeaders = request.headers,
    range = requestHeaders.range,
    ifNoneMatch = requestHeaders['if-none-match'],
    ifModifiedSince = requestHeaders['if-modified-since'],
    acceptEncoding = contentEncoding(
      requestHeaders['accept-encoding']
    ),
    encode = !!acceptEncoding.length && alwaysEncode.test(path),
    responseHeaders = {
      ETag: ''.concat(
        '"', stat.ino, '-', stat.size, '-', mtime.getTime(), '"'
      ),
      'Last-Modified': mtime
    },
    stream, parts, start, end, total, chunk;
  if (rangeTest.test(range)) {
    // .webm test
    // responseHeaders['Content-Type'] = 'video/webm';
    start = parseInt(RegExp.$1, 10);
    end = parseInt(RegExp.$2 || stat.size - 1, 10);
    responseHeaders['Content-Length'] = end - start + 1;
    responseHeaders['Content-Range'] = 'bytes '.concat(
      start, '-', end, '/', stat.size
    );
    responseHeaders['Accept-Ranges'] = 'bytes';
    response.writeHead(206, responseHeaders);
    stream = fs.createReadStream(path, {
      start: start,
      end: end
    });
    stream.on('error', onPipeError.bind(response));
    stream.pipe(response);
  } else {
    if (encode) {
      responseHeaders['Content-Encoding'] = acceptEncoding;
    }
    if ((ifNoneMatch  || ifModifiedSince) &&
      (!ifNoneMatch  || ifNoneMatch === responseHeaders.ETag) &&
      (!ifModifiedSince || mtime.getTime() <= Date.parse(ifModifiedSince))
    ) {
      response.writeHead(304, responseHeaders);
      response.end();
    } else {  
      // define the file type
      // responseHeaders['Content-Type'] = 'video/mp4';
      if (request.method === 'HEAD') {
        if (!encode) {
          responseHeaders['Content-Length'] = stat.size;
        }
        response.writeHead(200, responseHeaders);
        response.end();
      } else {
        stream = fs.createReadStream(path);
        if (encode) {
          stream = stream.pipe(acceptEncoding === 'deflate' ?
            zlib.createDeflate() : zlib.createGzip()
          )
        } else {
          responseHeaders['Content-Length'] = stat.size;
        }
        response.writeHead(200, responseHeaders);
        stream.on('error', onPipeError.bind(response));
        stream.pipe(response);
      }
      
    }
  }
}

function serveFile(path, evt, request, response) {
  if (path.slice(-4) === '.njs') {
    try {
      requireUpdated(path).onload(request, response);
    } catch(o_O) {
      onPipeError.call(response);
    }
  } else {
    serveStaticFile(path, evt, request, response);
  }
}

function onPipeError() {
  this.writeHead(500);
  this.end();
}

function notifyError(path, err, req, res) {
  res.writeHead(404);
  res.end();
}

function serverListener(req, res) {
  var
    location = url.parse(req.url, true),
    path = guardian.identify(location.pathname, true);
  if (!path || guardian.isHidden(path)) {
    console.log('violation');
  } else {
    switch(req.method) {
      case 'HEAD':
      case 'GET':
        checkURL(path, req, res);
        break;
    }
  }
}

function message(evt) {
  var
    path = evt.path,
    list = stat[path],
    i = 0,
    length = list.length,
    callback = evt.error ? notifyError : (
      evt.files ? serveDir : serveFile
    );
  delete stat[evt.path];
  while (i < length) {
    callback(path, evt, list[i++], list[i++]);
  }
}

function checkURL(path, req, res) {
  if (path in stat) {
    stat[path].push(req, res);
  } else {
    stat[path] = [req, res];
    process.send(path);
  }
}

process.on('uncaughtException', uncaughtException);

process.on('message', function firstMessage(evt) {
  process.removeListener('message', firstMessage);
  server = http.createServer(serverListener).listen(evt.port, evt.host);
  process.on('message', message);
});