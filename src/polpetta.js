
// the immutable polpetta definition
// in alphabetic order
defineImmutableProperties(polpetta, {

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
  code: function (code) {
    return  http.STATUS_CODES[code] ||
            "Internal Server Error";
  },

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
  encoding: function (ext) {
    return polpetta.type(ext).indexOf("text/") ?
      "binary" : "utf-8"
    ;
  },

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
  header: function (type) {
    ~type.indexOf("/") || (
      type = polpetta.type(type)
    );
    type.indexOf("text/") || (
      type += ";charset=utf-8"
    );
    return {
      "content-type": type
    };
  },

  /**
   * Returns a sanitized absolute path
   * from a generic one, relative or absolute,
   * where if the folder root is not the
   * very first part of the path
   * an empty string is returned instead
   * @param   String    a generic path to resolve
   * @returns String    a rsolved path or an empty string
   */
  resolve: resolve,

  // the root folder for this server
  root: path.resolve(DIR,
    arguments.length == 1 && HOST_USER_PORT ?
      CWD :
      arguments[0] || CWD
    ),

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
  type: function (type, def) {
    return EXTENSION_TO_MIME[(
      type[0] == "." ?
        type :
        "." + type
    ).toLowerCase()] || def || "text/html";
  },

  // current version
  version: "0.1.5"

});

polpettaKeys = keys(polpetta);
