var assert = require('assert');
var Group  = require('../lib/group');

suite('Group', function () {
  test('Instantiating a new group sets the UUID', function () {
    var g = new Group({ title: 'foobar' });
    assert(g.uuid);
    assert.equal(g.title, 'foobar');
  });

  test('Correctly deserializes an object', function () {
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

  test('Throws when serializing group without title', function () {
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

  test('Throws when serializing group without name', function () {
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

  test('Throws when serializing group without UUID', function () {
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
});

