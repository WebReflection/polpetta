
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


// wanna trust polpetta instances ?
freeze(Polpetta.prototype);
// don't worry, properties are secured runtime
// per each instance too
// (inheritance does not apply prototype descriptors)
