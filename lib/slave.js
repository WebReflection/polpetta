var
  cluster = require('cluster'),
  sPath = require('path'),
  http = require('http'),
  zlib = require('zlib'),
  url = require("url"),
  fs = require('fs'),
  constitution = require('./constitution.js'),
  guardian = require('./guardian.js'),
  firstContact = require('./first-contact.js'),
  postOffice = require('./post-office.js'),
  mimeType = require('./mime-type.js'),
  defaultMimeType = mimeType['.bin'],
  requireUpdated = constitution.FORCE_NJS_RELOAD ?
    require('require-updated') : require,
  contentEncoding_re = /\b(deflate|gzip)\b/,
  alwaysTryToCompress = new RegExp(
    '/\\.(' + constitution.COMPRESS + ')$/'),
  //boundaryMatch = /boundary=([^;]+)/,
  rangeTest = /bytes=(\d+)-(\d*)/,
  stat = Object.create(null),
  polpetta = {
    Server: 'p(^.^)lpetta'
  },
  dirListHeaders = {
    'Content-Type': 'text/html',
    Server: polpetta.Server
  },
  redirect = {
    Location: null,
    Server: polpetta.Server
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

function addFileToDirectory(file) {
  var
    simple = typeof file === 'string',
    fileName = simple ? file : file.path,
    isDir = simple ? false : file.isDirectory,
    className = isDir ? 'folder' : 'file';
  if (!guardian.isHidden(file)) {
    this.push(
      '<li class="' + className + '"><a href="' +
        guardian.escape(guardian.resolve(file.fullPath)) +
      '">' + guardian.escape(fileName) + '</a></li>'
    );
  }
}

function showDirectoryContent(path, files, request, response) {
  var
    dirName = guardian.escape(
      guardian.resolve(request.url, true) || guardian.sep
    ),
    output = [
      '<!doctype html>',
      '<html>',
        '<head>',
          '<title>Index of ', dirName, '</title>',
          '<meta name="viewport" content="',
            'width=device-width,',
            'initial-scale=1.0,',
            'maximum-scale=1.0,',
            'user-scalable=no',
          '"/>',
          '<meta name="generator" content="polpetta" />',
          '<style>',
            '*{font-family:sans-serif;}',
            'li.file{list-style:none;}',
            'li.folder a{text-decoration:none;}',
            'li.folder{list-style-type:square;}',
          '</style>',
        '</head>',
        '<body>',
          '<strong>Index of ', dirName, '</strong>',
          '<ul>'
    ];

  if (dirName != guardian.sep) {
    output.push(
      '<li class="folder"><a href="..">..</a></li>'
    );
  }
  files.forEach(addFileToDirectory, output);
  output.push(
        '</ul>',
      '</body>',
    '</html>'
  );
  response.writeHead(200, dirListHeaders);
  response.end(output.join(''));
}

function serveDir(path, evt, request, response) {
  if (request.url.slice(-guardian.sep.length) !== guardian.sep) {
    redirect.Location = request.url + guardian.sep;
    response.writeHead(301, redirect);
    response.end();
  } else {
    showDirectoryContent(path, evt.files, request, response);
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
    encode = !!acceptEncoding.length && alwaysTryToCompress.test(path),
    responseHeaders = {
      ETag: ''.concat(
        '"', stat.ino, '-', stat.size, '-', mtime.getTime(), '"'
      ),
      'Last-Modified': mtime,
      Server: polpetta.Server
    },
    stream, parts, start, end, total, chunk;
  responseHeaders['Content-Type'] = mimeType[sPath.extname(path)] || defaultMimeType;
  if (rangeTest.test(range)) {
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
  this.writeHead(500, polpetta);
  this.end();
}

function notifyError(path, err, req, res) {
  res.writeHead(404, polpetta);
  res.end();
}

function serverListener(request, response) {
  var
    location = url.parse(request.url, true),
    path = guardian.identify(location.pathname, true),
    contentType, chunks, boundary, post;
  if (!path.length || guardian.isHidden(path)) {
    console.log('violation');
  } else {
    switch(request.method) {
      case 'POST':
        postOffice.delivery(path, request, response);
      case 'HEAD':
      case 'GET':
        checkURL(path, request, response);
        break;
      /*
      case 'POST':
        postOffice.delivery()
        // path should be .njs or it does not even
        // make sense to accept POST and files
        // the post-office should also take care of this
        contentType = request.headers['content-type'];
        chunks = [];
        if (
          -1 < contentType.indexOf('multipart/form-data;') &&
          boundaryMatch.test(contentType)
        ) {
          request.setEncoding('binary');
          boundary = RegExp.$1;
        }
        post = {
          path: path,
          request: request,
          response: response,
          chunks: chunks,
          boundary: boundary || ''
        };
        post.callback = checkURL.bind(null, path, request, response, post);
        request
          // dangerous, might blow up the env RAM/space
          .on('data', chunks.push.bind(chunks))
          .on('error', onPipeError.bind(response))
          .on('end', postOffice.elaborate.bind(post))
        ;
        break;
        */
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