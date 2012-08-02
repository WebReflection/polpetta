
function ResponseSwitch() {
  var request = this.request;
  switch(request.method) {
    case "GET":
      // retrieve path info
      fsStat.call(this);
      break;
    case "POST":
      var
        contentType = request.headers["content-type"] ||
                      // ... just in case ...
                      request.headers["Content-Type"] ||
                      // while here something is probably wrong
                      "",
        chunks = []
      ;
      // files involved ?
      if (
        ~contentType.indexOf("multipart/form-data;") &&
        BOUNDARY_MATCH.test(contentType)
      ) {
        // grab files
        request.setEncoding("binary");
        defineKnownProperty(
          this,
          "boundary",
          chunks.boundary = RegExp.$1
        );
      }
      // prepare chunks
      chunks.polpetta = this;
      request.addListener(
        "data", chunks.push.bind(chunks)
      );
      request.addListener(
        "end", endOfChunks.bind(chunks)
      );
      break;
  }
}