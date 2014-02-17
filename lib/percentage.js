//
// # Percentage Criteria
//
// Passes x percent of incoming data bases on the intial bytes of a hashed
// string.
//
// Reference implementation for the criteria interface.
//

/* jshint node: true */
'use strict';

var assert   = require('assert');
var crypto   = require('crypto');
var _        = require('lodash');
var traverse = require('./util').traverse;

//
// ## Constructor
//
// All groups shares a single instance of the criteria. Hence no group specific
// state can be stored, and shouldn't be stored, on the object.
//
// The constructor can be used to set defaults etc.
//
var Percentage = module.exports = function Percentage() { };

//
// ## Name
//
// Sets the name of the test as it will be used in group configurations etc.
//
Percentage.getName = function name() { return 'percentage'; };

//
// ## Test
//
// Evaluates the input data against the criteria using the passed in options.
//
// `fn` should be called with an error object as the first argument if the
// test fails. If the test cannot be applied to the given data `fn` should
// be called as `fn(null, false)`. If the test passes `fn` should be called
// with `true` instead; `fn(null, true)`.
//
// * **data**, the input data. Arbitrary object.
// * **group**, the group the current instance of this criteria belongs to.
// * **options**, configuration object. Always an object.
// * **fn**, callback function. Allows for async tests.
//
Percentage.prototype.test = function percentageTest(data, group, options, fn) {
  if (!options.hashProps) return fn(new Error('missing hashProps options'), null);
  var str = this._createHashString(data, group, options);
  var sum = this._createChecksum(str);
  var grp = sum % 1000;

  // Straight up in or not test
  if (options.percent) {
    return fn(null, grp < (options.percent * 10)); // *10 because % 1000
  }
  // Return the apprioriate group for a given range
  else if (options.ranges) {
    var groups  = Object.keys(options.ranges);
    var belongs = [];
    groups.forEach(function (key) {
      var min = options.ranges[key].min * 10;
      var max = options.ranges[key].max * 10;
      if (grp >= min && grp <= max) {
        belongs.push(key);
      }
    });

    return fn(null, belongs.length ? belongs : false);
  }
  else {
    return fn(new Error('Missing percent or ranges option.'), null);
  }
};

// ---------------------------------------------------------------------------

Percentage.prototype._createHashString = function hashstr(data, group, options) {
  var hashProps = options.hashProps;
  assert(Array.isArray(hashProps), 'Salt must be an array.');
  var box = { data: data, group: group };
  var hashString = hashProps.map(function (keypath) {
    return traverse(keypath, _.cloneDeep(box));
  }).join('');

  return hashString;
};

Percentage.prototype._createChecksum = function checksum(str) {
  var sha = crypto.createHash('sha1');
  sha.update(str);
  var d = sha.digest();
  var sum = d[0] | (d[1] << 8) | (d[2] << 16);

  return sum;
};

