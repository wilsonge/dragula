'use strict';

var test = require('tape');

test('public api matches expectation', function (t) {
  t.equal(typeof window.dragula, 'function', 'dragula is a function');
  t.end();
});
