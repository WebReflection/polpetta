this.onload = function (req, res, polpetta) {
  polpetta.output.push(
    "Hello World"
  );
  polpetta.output.flush();
};