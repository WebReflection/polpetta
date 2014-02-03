node-header-stack
=================
### A `StreamStack` subclass that parses headers until an emtpy line is found.


This module can be used to parse "headers" from a `ReadableStream` until an empty
line is found. "headers" is a somewhat broad term that has a lot of edge-cases,
but this parser can be used to parse HTTP headers, MIME e-mail headers, CGI script
headers, multipart headers, and I'm sure much more.

The parser by default only emits a single _'headers'_ event when the end of the
headers have been reached. It can optionally emit a _'firstLine'_ event after the
first line has been parsed (useful for HTTP, off by default). See below for the
other parsing options available.


API
---

### new Parser([readableStream] [, options]) -> parser

Creates a new `Parser` instance that will parse headers. If a _readableStream_ is passed
in (optional), then 'data' events from it will be used to parse the header. An
optional _options_ argument may also be provided. Recognized options are:

  - `emitFirstLine` - (Default _false_) - If set to _true_, then the first line
       that gets parsed by the Parser won't be treated like a header line, but
       instead will be given back to the user in a _'firstLine'_ event.

  - `strictCRLF` - (Default _false_) - If set to _true_, then ONLY CRLF values
       will be allowed for the line delimiter. If _false_, then both CRLF and
       lone LF will be valid delimiters.

  - `strictSpaceAfterColon` - (Default _false_) - If set to _true_, an `error`
       will be emitted if a header is found without a space after the delimiter
       colon. If _false_ then a space after the colon will be optional.

  - `allowFoldedHeaders` - (Default _false_) - If set to _true_ then folded headers
       will be allowed. Folded headers are headers lines that start with whitespace,
       and are intended to be concatenated with the previous header. If _false_, then
       the parse will throw an error if a folded header is encountered.


#### parser.parse(b) -> undefined

If no `readableStream` instance was passed into the Parser constructor, then you
have to option to manually call `parse(buffer)` to do the parsing.


#### parser event 'headers' -> function(headers, leftover)

Emitted when the end of the headers has been parsed. _headers_ is a `Headers` instance,
which is a special Array subclass with other helper functions. _leftover_ __may__ be
a Buffer with any leftover data the Parser received before finishing, it will be the
beginning of anything after the headers, and should be fed into whatever is parsing
the Stream next.


#### parser event 'error' -> function(err)

Emitted if a malformed header line is encountered. i.e. a header line without a
valid delimiter. If this is emitted, then a _'headers'_ event will _NOT_ be emitted.


### new Headers() -> headers

The `Headers` class is an Array subclass that has some additional helper functions
to use and mutate the headers easily.


#### headers.addHeader(key, value) -> undefined

Adds a new header to the end of the list of headers with the given _key_ and _value_.


#### headers.toString([ options ]) -> undefined

The `toString` function of the `Headers` class can be used to turn a headers instance
back into it's sendable form. The default options are for the most common use cases,
but you may specify:

  - `firstLine` - (Default _false_) - If set to a String instance, then the given string
       will be used as the first line of the output string (useful for HTTP).

  - `delimiter` - (Default _'\\r\\n'_) - The delimiter that should be used in between
       each header and to signify the end of the headers.

  - `emptyLastLine` - (Default _true_) - If _true_ then the returned String will contain
       another "delimiter" at the end, to signify the end of the headers.



[Node]: http://nodejs.org
