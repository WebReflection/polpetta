#!/usr/bin/env node

// In a CGI script, first the http headers are written.
// "Status" is a special header that will be used as the response status code.
console.log("Status: 201");
console.log("Content-Type: text/plain");

// A blank line ends the headers.
console.log("");

// And anything else up to EOF is the http response body.
console.log("Hello CGI script, from Node!");
