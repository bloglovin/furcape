var assert  = require('assert');
var furcape = require('../');
var compare = require('../lib/compare');
var equal   = require('../lib/equality');
var percent = require('../lib/percentage');

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

  it('correctly evaluates one group', function (done) {
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

  it('correctly evaluates one group failing', function (done) {
    var f = furcape();
    f.registerCriteria(compare);
    f.registerCriteria(equal);

    f.createGroup('foo', 'bar', {
      compare: {
        lessThan: { a: 'data.b', b: 'data.a' },
      },
      equality: { a: 'data.c', b: 'group.name' }
    });

    f.evaluateGroup({
      a: 1337,
      b: '80085',
      c: 'bar'
    }, 'bar', function (err, passed) {
      assert(!err);
      assert(!passed);
      done();
    });
  });

  it('correctly evaluates all groups', function (done) {
    var f = furcape();
    f.registerCriteria(compare);
    f.registerCriteria(equal);
    f.registerCriteria(percent);

    f.createGroup('foo', 'foo', {
      compare: {
        lessThan: { a: 'data.a', b: 'data.b' },
      }
    });

    f.createGroup('bar', 'bar', {
      equality: { a: 'data.c', b: 'group.name' }
    });

    f.createGroup('percent', 'percent', {
      percentage: {
        hashProps: ['a', 'group.name'],
        ranges: {
          a: { min: 0, max: 50 },
          b: { min: 50.000001, max: 100 }
        }
      }
    });

    f.evaluate({
      a: 1337,
      b: '80085',
      c: 'bar'
    }, function (err, results) {
      assert(!err);
      assert(results.indexOf('foo') !== -1);
      assert(results.indexOf('bar') !== -1);
      assert(results.indexOf('b') !== -1);
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

