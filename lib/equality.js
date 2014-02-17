//
// # Equality
//
// Criteria for checking data property equalness.
//

/* jshint node: true */
'use strict';

var traverse = require('./util').traverse;

//
// ## Constructor
//
var Equality = module.exports = function Equality() { };

//
// ## Name
//
Equality.getName = function name() { return 'equality'; };

//
// ## Test
//
Equality.prototype.test = function equalityTest(data, group, options, fn) {
  if (!options.a || !options.b) {
    return fn(new Error('Missing options a and b'), null);
  }

  var box = { data: data, group: group, options: options };
  var a   = traverse(options.a, box);
  var b   = traverse(options.b, box);

  if (typeof a !== 'undefined' && typeof b !== 'undefined') {
    return fn(null, a === b);
  }
  else {
    return fn(null, false);
  }
};

