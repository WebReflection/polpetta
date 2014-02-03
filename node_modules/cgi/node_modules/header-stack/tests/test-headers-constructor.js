var assert = require('assert');
var Headers = require('../headers');


var h1 = Headers();
assert.ok(h1 instanceof Headers);
assert.ok(Array.isArray(h1));
assert.equal(h1.length, 0);


var h2 = Headers({
  'key': 'value'
});
assert.equal(h2.length, 1);


var h3 = Headers([
  {key:'foo', value:'bar'},
  {key:'another', value:'test'},
  ['baz', 'brah'],
  ['last', 'one']
]);
assert.equal(h3.length, 4);
