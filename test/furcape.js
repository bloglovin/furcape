var assert  = require('assert');
var furcape = require('../');

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
});

// Mock criteria
var testeria = function testeria() {

};
testeria.getName = function () { return 'testeria'; };

var festeria = function festeria() {

};
festeria.getName = function () { return 'festeria'; };

