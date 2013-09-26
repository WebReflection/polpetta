
Object.defineProperties(Polpetta.prototype, {

  // [polpetta commons]
  /**
   * Returns a code description
   * assuming you know that 200 is 200
   * and the code you want to know is the
   * static answer provided by a webserver.
   * @param   Number    the response code as number
   * @returns String    the string code associated
   * @example
   *    polpetta.code(200); // "OK"
   *    polpetta.code(404); // "Not Found"
   */
  code: defineKnownGetter("code", polpetta_code),

  /**
   * Returns the content encoding accordingly
   * with the file type. Please note this is
   * just for most common cases and nothing
   * different from "utf-8" or "binary"
   * will be returned (so far)
   * @param   String    the file type
   * @returns String    "utf-8" or "binary"
   * @example
   *    polpetta.encoding("txt"); // => "utf-8"
   *    polpetta.encoding("pdf"); // => "binary"
   */
  encoding: defineKnownGetter("encoding", polpetta_encoding),

  /**
   * Returns a usable object for
   * response.writeHead(code, header)
   * This is mainly used for generic *non* .njs files
   * as shortcut but feel free to enrich
   * the returned object as you need
   * @param   String    the content type to use
   *                    txt, .txt, text/plain, what/ever
   * @returns Object    an object usable as header
   * @example
   *    polpetta.header("txt");
   *    // => {"content-type":"text/plain;charset=utf-8"}
   */
  header: defineKnownGetter("header", polpetta_header),

  /**
   * Redirect to a different page.
   * @param   String    the new page to be redirected
   * @example
   *    polpetta.redirect("/folder/file.html");
   */
  redirect: defineKnownGetter("redirect", polpetta_redirect),

  /**
   * Returns a sanitized absolute path
   * from a generic one, relative or absolute,
   * where if the folder root is not the
   * very first part of the path
   * an empty string is returned instead
   * @param   String    a generic path to resolve
   * @returns String    a rsolved path or an empty string
   */
  resolve: defineKnownGetter("resolve", polpetta_resolve),

  // the root folder for this server
  root: defineKnownGetter("root", root),

  /**
   * Returns a valid type (mime/type)
   * ased on official Apache type to extension file
   * @param   String    a generic etension or type
   * @param   String    optional type, default is "text/html"
   * @returns String    the usable mime or content type
   * @link  http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
   * @example
   *    polpetta.type("txt");   // => "text/plain"
   *    polpetta.type("html");  // => "text/html"
   *    polpetta.type(".js");   // => "application/javascript"
   */
  type: defineKnownGetter("type", polpetta_type),


  // [get, post, file, and cookie]

  // p.get("param"[, "default"]) => $_GET['param'] || 'default'
  // p.get.keys(); => ["g1", "g2", ...]
  get: defineGetter(function () {
    return defineGPF(this, "get", this.url.query);
  }),

  // p.post("param"[, "default"]) => $_POST['param'] || 'default'
  // p.post.keys(); => ["p1", "p2", ...]
  post: defineGetter(function () {
    return emptyGetter;
  }),

  // p.file("param"[, {default}]) => $_FILES['param'] || {default}
  // p.file.keys(); => ["f1", "f2", ...]
  file: defineGetter(function () {
    return emptyGetter;
  }),

  // p.cookie("param"[, "default"]) => $_COOKIE['param'] || 'default'
  // p.cookie.set("param", "value"[, exp[, path[, domain[, secure]]]]);
  // p.cookie.keys(); => ["c1", "c2", ...]
  cookie: defineGetter(function () {
    var
      property = "cookie",
      headersCookie = this.request.headers.cookie,
      cookie = {},
      cookies = []
    ;
    headersCookie &&
    headersCookie.split(/(?:,|;) /).forEach(
      parseCookie, cookie
    );
    return defineNotEnumerableProperty(
      defineKnownProperty(
        defineKnownProperty(
          this,
          property,
          withKeysMethod(
            getValue,
            cookie
          )
        )[property],
        "set",
        setCookie.bind(
          cookies
        )
      ),
      "_", cookies
    );
  }),


  // [output and flush]

  // p.output.push("content");
  // p.output.flush([code[, type[, encoding]]]);
  output: defineGetter(function () {
    var property = "output";
    return defineKnownProperty(
      this,
      property,
      defineKnownProperty(
        [], "flush", flushResponse.bind(this)
      )
    )[property];
  })

});


// [objects properties]
commonDescriptor.value = {};
[
  // p.request => original request object
  "request",

  // p.response => original response object
  "response",

  // p.url => parsed url object with pathname, query, etc
  //          see node.js API require("url").parse(request.url, true)
  "url"

].forEach(defineEachProperty, Polpetta.prototype);


// [strings properties]
commonDescriptor.value = "";
[
  // not empty string only when files have been posted
  "boundary",

  // p.ext; => filename extension
  "ext",

  // p.path; => /usr/name/folder/
  "path"

].forEach(defineEachProperty, Polpetta.prototype);


// [shared version]
commonDescriptor.value = version;
defineProperty(Polpetta.prototype, "version", commonDescriptor);

//SSH DUMMY KEYS -- in prototype since it will be freezed.
/*
 * Server certificate:
 * 	 subject: C=IT; ST=GrumpyLandia; L=GrumpyCity; O=Grumpy Cat LTD; CN=Grumpy; emailAddress=cat.g@gmail.com
 * 	 start date: 2013-09-26 09:55:26 GMT
 * 	 expire date: 2038-05-18 09:55:26 GMT
 * 	 common name: Grumpy (does not match 'localhost')
 * 	 issuer: C=IT; ST=GrumpyLandia; L=GrumpyCity; O=Grumpy Cat LTD; CN=Grumpy; emailAddress=cat.g@gmail.com
 * 	 SSL certificate verify result: self signed certificate (18), continuing anyway.
*/
//TODO allows ovveriding this, require a bit of documentation though.
    Polpetta.prototype.key = ['-----BEGIN RSA PRIVATE KEY-----',
        'MIICXQIBAAKBgQDLrcjMw8Gcg+jlit75Arz+HnMs/lG4hP5nSBL2H449i+KsQHJz',
        '6EA+uyAqTSwyfhqRMkdLUkYoXAQP4SklMCkaxaBBrd6dem8tT1ckIaA0PfdJYfDC',
        'uKczHG2klnq2/NAw/O33AK58dbtxfSRzFJPMs3gBtt6/UWti4Ilb1aQe9wIDAQAB',
        'AoGBAMoU13iJ9MuUePtd6FJJbDf5AC8w+OXJVhwk/2Mg9eCMrM5YdvYXBb73rDcs',
        'MGC8iyFqMCBENgWPHhyfOlKCURRQxb2u+xWBssbM940NAl0Gie9WzPxw041QmwDQ',
        '0Qqy1aC/Okcz0lbTDbidbnc6fvTV1aC65Pr2+98vgw7cVWlxAkEA5csSTCGCF3vS',
        'nRsVV88MJCZLP2/GgP7CSeMDmLHwTCVr2JmDVa+R/1Dom+kXG3Cr9Q0xCy1RzO4G',
        'OddAOotG+QJBAOLoSjXHPzf48md/8c8vgB9NBc0hlMuY54xMjSxACCb4g1miPh+Z',
        'CKeGZgxHirndJi6GAJYwoI3MLWuqkyM8YW8CQQCU4MhuApeiV1rQ5qchSMd49EZ0',
        'Rxq4oFWIQUgnOcGR0/zXTD5G2YUhgW3y9UU/RfRiw7UupKIGv3/RIaA/TdUhAkBz',
        '2Q0qb9PDDAMW/KfElAfh8z0nAiIp4KM3ak4ZbYe7/d1yAfedwlA81816L3yQcGxy',
        'DFB4XdNbEgeOlMQSlV1ZAkB6NnAfNJDkwwpN2sM3QM4OtvWsWHYO2bFbRGqoOryq',
        'UEACAx5/UdL4MPhUf5oyDOauu/UpV/BqObFLnvunj05O',
        '-----END RSA PRIVATE KEY-----'].join('\n')

    Polpetta.prototype.ca = [['-----BEGIN CERTIFICATE REQUEST-----',
        'MIIBxDCCAS0CAQAwgYMxCzAJBgNVBAYTAklUMRUwEwYDVQQIEwxHcnVtcHlMYW5k',
        'aWExEzARBgNVBAcTCkdydW1weUNpdHkxFzAVBgNVBAoTDkdydW1weSBDYXQgTFRE',
        'MQ8wDQYDVQQDEwZHcnVtcHkxHjAcBgkqhkiG9w0BCQEWD2NhdC5nQGdtYWlsLmNv',
        'bTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAy63IzMPBnIPo5Yre+QK8/h5z',
        'LP5RuIT+Z0gS9h+OPYvirEByc+hAPrsgKk0sMn4akTJHS1JGKFwED+EpJTApGsWg',
        'Qa3enXpvLU9XJCGgND33SWHwwrinMxxtpJZ6tvzQMPzt9wCufHW7cX0kcxSTzLN4',
        'Abbev1FrYuCJW9WkHvcCAwEAAaAAMA0GCSqGSIb3DQEBBQUAA4GBAJJv/mdIboZH',
        'fZIEz0pw2vmKhpceoiXhz7HTllFZ/om/msAPRA5V0kyXEZJ32YIUBv2MR6cHtoHQ',
        'vag7cw+GifXSgyT8loDG2dAjvWtiFXXGKN6YnkJW6iXOHDVo5ETdaJCI3pUhHVSB',
        'GGtjL91MJhEmB6q7SDNfaBroQ9UYAu4C',
        '-----END CERTIFICATE REQUEST-----'].join('\n')];

    Polpetta.prototype.cert = ['-----BEGIN CERTIFICATE-----',
        'MIICfzCCAegCCQD9vawlAR85XjANBgkqhkiG9w0BAQUFADCBgzELMAkGA1UEBhMC',
        'SVQxFTATBgNVBAgTDEdydW1weUxhbmRpYTETMBEGA1UEBxMKR3J1bXB5Q2l0eTEX',
        'MBUGA1UEChMOR3J1bXB5IENhdCBMVEQxDzANBgNVBAMTBkdydW1weTEeMBwGCSqG',
        'SIb3DQEJARYPY2F0LmdAZ21haWwuY29tMB4XDTEzMDkyNjA5NTUyNloXDTM4MDUx',
        'ODA5NTUyNlowgYMxCzAJBgNVBAYTAklUMRUwEwYDVQQIEwxHcnVtcHlMYW5kaWEx',
        'EzARBgNVBAcTCkdydW1weUNpdHkxFzAVBgNVBAoTDkdydW1weSBDYXQgTFREMQ8w',
        'DQYDVQQDEwZHcnVtcHkxHjAcBgkqhkiG9w0BCQEWD2NhdC5nQGdtYWlsLmNvbTCB',
        'nzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAy63IzMPBnIPo5Yre+QK8/h5zLP5R',
        'uIT+Z0gS9h+OPYvirEByc+hAPrsgKk0sMn4akTJHS1JGKFwED+EpJTApGsWgQa3e',
        'nXpvLU9XJCGgND33SWHwwrinMxxtpJZ6tvzQMPzt9wCufHW7cX0kcxSTzLN4Abbe',
        'v1FrYuCJW9WkHvcCAwEAATANBgkqhkiG9w0BAQUFAAOBgQA9c1UF2lbYGlNFruMO',
        'd47scNsZBkSSnRRMSloNhO2KIOhRA57WjFk9b0XmCe1gQuNlEWVHf+HZv/Xet8+9',
        'LRhImq4KAG5R+z3TjBrtI/yrVWEzNk+mnygRvsX6MoDKNDbzE6y87tviBUxNgAWB',
        'r/pX8MbqC5NpbLys0A1cpm9tRw==',
        '-----END CERTIFICATE-----'].join('\n');



// wanna trust polpetta instances ?
freeze(Polpetta.prototype);
// don't worry, properties are secured runtime
// per each instance too
// (inheritance does not apply prototype descriptors)
