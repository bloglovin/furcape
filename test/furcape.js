var assert  = require('assert');
var furcape = require('../');
var compare = require('../lib/compare');
var equal   = require('../lib/equality');

describe('Furcape', function () {
  it('returns a new object when called as a function', function () {
    var f = furcape();
    assert(f.criteria);
  });

  it('correctly registers a single criteria', function () {
    var f = furcape();
    f.registerCriteria(testeria);
    assert(f.criteria.testeria);
  });

  it('throws when registering same criteria twice', function () {
    var f = furcape();
    f.registerCriteria(testeria);

    assert.throws(function () {
      f.registerCriteria(testeria);
    }, /already defined\.$/);
  });

  it('registers an array of criteria', function () {
    var f = furcape();
    f.registerCriteria([testeria, festeria]);
    assert(f.criteria.testeria);
    assert(f.criteria.festeria);
  });

  it.only('correctly evaluates one group', function (done) {
    var f = furcape();
    f.registerCriteria(compare);
    f.registerCriteria(equal);

    f.createGroup('foo', 'bar', {
      compare: {
        lessThan: { a: 'data.a', b: 'data.b' },
      },
      equality: { a: 'data.c', b: 'group.name' }
    });

    f.evaluateGroup({
      a: 1337,
      b: '80085',
      c: 'bar'
    }, 'bar', function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });
});

// Mock criteria
var testeria = function testeria() {

};
testeria.getName = function () { return 'testeria'; };

var festeria = function festeria() {

};
festeria.getName = function () { return 'festeria'; };

