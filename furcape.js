//
// # Furcape
//

/* jshint node: true */
'use strict';

var async  = require('async');
var assert = require('assert');
var Group  = require('./lib/group');

var Furcape = module.exports = function Furcape(options) {
  if (!(this instanceof Furcape)) {
    return new Furcape(options);
  }

  this.criteria = {};   // Holds available criteria
  this.groups   = {};   // Holds defined groups
};

//
// ## Register Criteria
//
// Registers one or many criteria. These criteria will then be available for
// use in groups.
//
// * **criteria**, an object constructor conforming to the criteria interface.
//
// **Returns** nothing.
//
Furcape.prototype.registerCriteria = function regCrit(criteria) {
  if (Array.isArray(criteria)) {
    return criteria.forEach(this.registerCriteria.bind(this));
  }

  if (this.criteria[criteria.name]) {
    throw new Error('Criteria ' + criteria.name + ' already defined.');
  }

  this.criteria[criteria.name] = criteria;
};

//
// ## Create Group
//
// Define a new group with the given rules.
//
// * **title**, human readable name of group.
// * **name**, machine readable name of group.
// * **criteria**, an object that defines the group.
//
// **Returns** the newly created group.
//
Furcape.prototype.createGroup = function createGroup(title, name, criteria) {
  if (this.groups[name]) {
    throw new Error('Group ' + name + ' already exists.');
  }

  this.groups[name] = new Group();
};

//
// ## Restore a Group
//

//
// ## Evaluate Data
//
// Runs data through all, or a subset of, the defined groups and decides what
// groups matches the given data object.
//
// * **data**, an object to test.
// * **groups**, an array of groups to test. Omit to test against all groups.
//
// **Returns** an array of matching groups. Empty array in case of no matches.
//
Furcape.prototype.evaluate = function evaluate(data, groups) {

};

//
// ## Evaluate Group
//
// Evaluates data against one group and returns a boolean if the data passes
// the tests for that group.
//
// * **data**, an object to test.
// * **group**, the name of the group to test.
// * **callback**, `function (err, passed) {}`.
//
Furcape.prototype.evaluateGroup = function evalGroup(data, groupName, fn) {
  var group = this.groups[groupName];
  assert(group, 'Cannot evaluate data against non-existing group: ' + groupName);

  var self = this;
  function test(criteria) {
    return function testCriteria(callback) {
      if (!self.criteria[criteria]) {
        return callback(
          new Error('Missing criteria ' + criteria + ' when testing group ' + groupName),
          null
        );
      }

      self.criteria[criteria].test(data, group, callback);
    };
  }

  var tests = Object.keys(group).map(test);
  async.parallel(tests, function testCallback(err, result) {
    if (err) return fn(err, false);
    var pass = false;
    if (result.indexOf(false) === -1) {
      pass = result.indexOf(true) !== -1;
    }

    return fn(null, pass);
  });
};

