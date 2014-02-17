//
// # Date Criteria
//
// Let's you check if a date is before or after or inbetween dates.
//

/* jshint node: true */
'use strict';

var moment   = require('moment');
var traverse = require('./util').traverse;

//
// ## Constructor
//
var Datetime = module.exports = function Datetime() { };

//
// ## Name
//
Datetime.getName = function name() { return 'datetime'; };

//
// ## Test
//
// Evaluates input data.
//
// * **data**, the input data. Arbitrary object.
// * **group**, the group the current instance of this criteria belongs to.
// * **options**, configuration object. Always an object.
// * **fn**, callback function. Allows for async tests.
//
Datetime.prototype.test = function datetimeTest(data, group, options, fn) {
  var date = traverse(options.dateName, data);
  if (!date) {
    // Will mark test as not applicable due to missing date.
    return fn(null, false);
  }

  var parsed = moment(date);
  if (!parsed.isValid()) {
    return fn(new Error('invalid date input'), null);
  }

  var after  = true;
  var before = true;

  if (options.after) {
    after = parsed.isAfter(options.after);
  }

  if (options.before) {
    before = parsed.isBefore(options.before);
  }

  fn(null, (after && before));
};

