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

var assert = require('assert');
var crypto = require('crypto');
var _      = require('lodash');

// Not really max, but our max.
var INT_MAX = (255+(255<<8)+(255<<16));

//
// ## Constructor
//
// All groups shares a single instance of the criteria. Hence no group specific
// state can be stored, and shouldn't be stored, on the object.
//
// The constructor can be used to set defaults etc.
//
var Percentage = module.exports = function Percentage() {
};

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
  var str = this._createHashString(data, group, options);
  var sum = this._createChecksum(str);
  var grp = sum / INT_MAX * 100;
  fn(null, grp < options.percent);
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
  var digest = sha.digest();
  var sum = digest[0] + (digest[1] << 8) + (digest[2] << 16);

  return sum;
};

function traverse(keypath, obj) {
  var p = keypath.split('.');
  while (obj && p.length) {
    obj = obj[p.shift()];
  }
  return obj;
}

