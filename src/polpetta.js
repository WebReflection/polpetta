
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
            http.STATUS_CODES[404];
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
   *    // => {"Content-Type":"text/plain"}
   */
  header: function (type) {
    return {
      "Content-Type": ~type.indexOf("/") ?
        type : polpetta.type(type)
    };
  },

  /**
   * Returns a sanitized absolute path
   * from a generic one, relative or absolute,
   * where if the folder root is not the
   * very first part of the path
   * an empty string is returned instead
   */
  resolve: function (src) {
    src = path.resolve(
  		path.join(polpetta.root, src)
  	);
    return src.indexOf(polpetta.root) ? "" : src;
  },
  root: arguments[0] || __dirname,
  type: function (type) {
    return EXTENSION_TO_MIME[
      type[0] == "." ?
        type :
        "." + type
    ] || "text/html";
  }
});

keys = Object.keys(polpetta);
