
function contentEncoding(acceptEncoding) {
  return contentEncoding_re.test(acceptEncoding) && RegExp.$1;
}

var contentEncoding_re = /\b(deflate|gzip)\b/;
