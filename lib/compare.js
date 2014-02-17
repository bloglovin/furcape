//
// # Compare
//
// Compare two properties against each other.
//
// **Maybe the Equality test should've been in this one.**
//

/* jshint node: true */
'use strict';

var traverse = require('./util').traverse;

//
// ## Constructor
//
var Compare = module.exports = function Compare() {
  this.operators = {
    lessThan: true,
    lessThanEqual: true,
    greaterThan: true,
    greaterThanEqual: true
  };
};

//
// ## Name
//
Compare.getName = function name() { return 'compare'; };

//
// ## Test
//
Compare.prototype.test = function compareTest(data, group, options, fn) {
  var self    = this;
  var results = [];

  try {
    results = Object.keys(options).map(function (test) {
      if (self.operators[test]) {
        var box = { data: data, group: group, options: options };
        var a   = parseInt(traverse(options[test].a, box), 10);
        var b   = parseInt(traverse(options[test].b, box), 10);
        return self[test].apply(self, [a, b]);
      }
      else {
        throw new Error('Invalid comparison test: ' + test);
      }
    });
  } catch (err) {
    return fn(err, null);
  }

  fn(null, results.indexOf(false) === -1);
};

// --------------------------------------------------------------------------

Compare.prototype.lessThan = function compareLess(a, b) {
  return a < b;
};

Compare.prototype.lessThanEqual = function compareLessEqual(a, b) {
  return a <= b;
};

Compare.prototype.greaterThan = function compareGreater(a, b) {
  return a > b;
};

Compare.prototype.greaterThanEqual = function compareGreaterEqual(a, b) {
  return a >= b;
};

