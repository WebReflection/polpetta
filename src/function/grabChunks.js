
function grabChunks(chunk) {
  this.push(chunk);
}

grabChunks.end = function (
  file,
  polpetta,
  request,
  response,
  query,
  ext
) {
  fs.stat(
    file,
    fileStats.bind(
      this,
      file,
      polpetta,
      request,
      response,
      query,
      ext
    )
  );
};