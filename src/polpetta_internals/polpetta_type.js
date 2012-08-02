
function polpetta_type(type, def) {
  return EXTENSION_TO_MIME[(
    type[0] == "." ?
      type :
      "." + type
  ).toLowerCase()] || def || "text/html";
}
