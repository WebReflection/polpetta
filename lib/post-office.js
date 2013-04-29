const
  NHL = '\r\n',
  FILE_NAME = /filename=("|')?([^\1]*?)\1/,
  NAME = /name=("|')?([^\1]*?)\1/,
  BOUNDARY_MATCH = /boundary=([^;]+)/;

var
  fs = require('fs'),
  sPath = require('path'),
  constitution = require('./constitution.js'),
  tmpFiles = 0,
  data = [];

this.delivery = function delivery(path, request, response) {
  var
    contentType = request.headers['content-type'],
    track = {
      boundary: -1 < contentType.indexOf('multipart/form-data;') &&
                BOUNDARY_MATCH.test(contentType) ?
                  RegExp.$1 : '',
      path: path,
      request: request,
      response: response,
      chunks: ''
    };
  data.push(track);
  if (track.boundary.length) {
    request.setEncoding('binary');
    fs.createWriteStream(
      track.tmpName =  sPath.join(
        constitution.TMP, '__polpetta' + tmpFiles++
      )
    )
      .on('error', dropTrackFromData.bind(track))
      .on('end', findOutWhatKindOfDataIsIt.bind(track))
      .pipe(request)
    ;
  } else {
    request
      .on('error', dropTrackFromData.bind(track))
      .on('data', addDataChunks.bind(track))
      .on('end', findOutWhatKindOfDataIsIt.bind(track))
  }
};

function dropTrackFromData() {
  data.splice(data.indexOf(this), 1);
  this.request.connection.destroy();
}

function findOutWhatKindOfDataIsIt() {
  
}

function addDataChunks(data) {
  this.chunks += data;
  if (1e6 < this.chunks.length) {
    dropTrackFromData.call(this);
  }
}

function elaborating(track) {
  return this === track.request;
}

this.waitingFor = function waitingFor(request) {
  return data.some(elaborating, request);
}



this.elaborate = function elaborate() {
  this.i = 0;
  if (this.boundary.length) {
    this.posted = [];
    this.received = Object.create(null);
    this.chunks.join('').split(this.boundary).forEach(
      forEachChunkOfData, this
    );
  }
  if (this.i === 0) {
    this.callback();
  }
};

function assignSizeAndGoOn(file, err, fStat) {
  file.stat = fStat;
  if (!--this.i) this.callback();
}

function onTMPFileCreated(file, err) {
  if (err) {
    file.error = err;
  } else {
    fs.stat(file.tmp_name, assignSizeAndGoOn.bind(this, file));
  }
}

function forEachChunkOfData(data, i) {
  // TODO: double check this stuff
  var
    line = data.split(NHL),
    headers = line.slice(
      1, line.indexOf(NHL, 1)
    ),
    name,
    filename,
    file,
    parse,
    content
  ;
  i = 0;
  while (i < headers.length) {
    parse = headers[i++];
    if (NAME.test(parse)) {
      name = RegExp.$2;
      content = line.slice(
        line.indexOf(NHL, i) + 1, line.length - 1
      ).join(NHL);
      if (FILE_NAME.test(parse)) {
        filename = RegExp.$2;
        if (filename.length) {
          file = {
            name: filename,
            type: polpetta_type(
              path.extname(filename),
              'application/octet-stream'
            ),
            error: null,
            size: 0
          };
          if (name in this.received) {
            if (this.received[name] instanceof Array) {
              this.received[name].push(file);
            } else {
              this.received[name] = [this.received[name], file];
            }
          } else {
            this.received[name] = file;
          }
          this.i++;
          fs.writeFile(
            file.tmp_name = path.join(
              constitution.TMP, name + Math.random() + filename
            ),
            content,
            'binary',
            onTMPFileCreated.bind(
              this,
              file
            )
          );
        }
      } else if (content.length) {
        this.posted.push(
          encodeURIComponent(name) +
          '=' +
          encodeURIComponent(content)
        );
      }
      break;
    }
  }
}