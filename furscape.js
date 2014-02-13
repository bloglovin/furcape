//
// # Furcape
//

/* jshint node: true */
'use strict';

var Group = require('./lib/group');

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
Furcape.prototype.createGroup = function createGroup() {

};

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

