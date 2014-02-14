var assert = require('assert');
var Group  = require('../lib/group');

describe('Group', function () {
  it('instantiates new group with UUID', function () {
    var g = new Group({ title: 'foobar' });
    assert(g.uuid);
    assert.equal(g.title, 'foobar');
  });

  it('correctly deserializes an object', function () {
    var data = {
      title: 'a',
      name: 'b',
      uuid: 'c',
      criteria: {
        d: 'e'
      }
    };

    var g = new Group(data);
    assert.equal(g.title, 'a');
    assert.equal(g.name, 'b');
    assert.equal(g.uuid, 'c');
    assert.equal(g.criteria.d, 'e');
  });

  it('throws when serializing group without title', function () {
    var data = {
      name: 'b',
      uuid: 'c',
      criteria: {
        d: 'e'
      }
    };
    var g = new Group(data);

    assert.throws(function () {
      g.serialize();
    }, /title\.$/);
  });

  it('throws when serializing group without name', function () {
    var data = {
      title: 'b',
      uuid: 'c',
      criteria: {
        d: 'e'
      }
    };
    var g = new Group(data);

    assert.throws(function () {
      g.serialize();
    }, /name\.$/);
  });

  it('throws when serializing group without UUID', function () {
    var data = {
      title: 'b',
      name: 'c',
      criteria: {
        d: 'e'
      }
    };
    var g = new Group(data);
    g.uuid = false;

    assert.throws(function () {
      g.serialize();
    }, /uuid\.$/);
  });

  it('correctly serializes an object', function () {
    var data = {
      title: 'a',
      name: 'b',
      uuid: 'c',
      criteria: {
        d: 'e'
      }
    };
    var g = new Group(data);
    var obj = g.serialize();
    assert.equal(obj.title, 'a');
    assert.equal(obj.name, 'b');
    assert.equal(obj.uuid, 'c');
    assert.equal(obj.criteria.d, 'e');
  });

  it('creates a new group when called as a function', function () {
    var g = Group();
    assert(g.uuid);
  });
});

