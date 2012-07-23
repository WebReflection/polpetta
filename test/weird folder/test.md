Isn't a 1kb markdown parser lovely ?
====================================

This entry is a bit out of the *love between people* context but I believe some developer gonna love it in any case!
A markdown is an _easy to read and quite easy to parse_ syntax, ideal for documents
that could be understood by human, and easily converted by machines.

You are reading markdown now!
-----------------------------
This document is generated on the fly via the proposed script.
Here the code **example** used for this page:

    this.onload = function () {
      document.body.innerHTML = markdown(
        document.body.textContent
      );
    };

You can find a very nice guide about [how to markdown here](http://daringfireball.net/projects/markdown/syntax "markdown style guide").

### What is supported ?
  * headers with = or - notation
  * headers with # notation
  * blockquotes and nested blockquotes
  * ordered and unordered lists
  * inline links with arbitrary title
  * &lt;em&gt; via single asterisks/underscore, or double for &lt;strong&gt; tag
  * inline `code` via `` ` `` backtick

### What is not supported ? ###
  * paragraphs are missings
  * nested lists and nested markdown inside lists
  * links with references and/or id
  * raw html is not recognized, validated, parsed
  * images are not available ( could not fit into 1024 )

> and just to demonstrate it works
> > this is a nested blockquote example :-)
> have a lovely day

- - -
&copy; WebReflection