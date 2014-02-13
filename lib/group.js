//
// # Group
//
// Data container for a set of criteria. Can be serialized and deserialized to
// allow for easy persistence.
//
// "Why is this it's own object, it doesn't really do anything?" You might ask.
// Yeah, it feels a bit Java. But it's just a way of:
//
//  1. Making sure that the object looks as it should.
//  2. Automating UUID creation.
//  3. Future-proofing (I added this one just to make it three).
//

/* jshint node: true */
'use strict';

var uuid   = require('tiny-uuid');
var assert = require('assert');

var Group = module.exports = function Group(o) {
  if (!(this instanceof Group)) {
    return new Group(o);
  }

  this.title    = '';       // Human readable title
  this.name     = '';       // Machine name
  this.uuid     = null;     // Unique identifier
  this.criteria = {};       // This group's rules

  if (o) {
    this.deserialize(o);
  }
  else {
    this.uuid = uuid();
  }
};

//
// ## Serialize
//
// **Returns** a JSON-stringifyable object.
//
Group.prototype.serialize = function groupSerialize() {
  assert(this.title.length, 'Cannot serialize group with no title.');
  assert(this.name.length, 'Cannot serialize group with no name.');

  var obj = {
    title: this.title,
    name: this.name,
    uuid: this.uuid,
    criteria: this.criteria
  };

  return obj;
};

//
// ## Deserialize
//
// Takes a previously serialized, or a valid group configuration, and sets up
// a group object based on that.
//
// * **config**, group definition.
//
// **Returns** nothing.
//
Group.prototype.deserialize = function groupDeserialize(config) {
  assert(config.title.length, 'Cannot deserialize group with no title.');
  assert(config.name.length, 'Cannot deserialize group with no name.');
  assert(config.uuid.length, 'Cannot deserialize group with no uuid.');
  assert(Object.keys(config.criteria).length, 'Cannot deserialize without criteria');

  this.title    = config.title;
  this.name     = config.name;
  this.uuid     = config.uuid;
  this.criteria = config.criteria;
};

