var assert   = require('assert');
var Equality = require('../lib/equality');
var Group    = require('../lib/group');

describe('Equality', function () {
  it('correctly reports it\'s name', function () {
    assert.equal(Equality.getName(), 'equality');
  });

  it('correctly determines equalness between two data properties', function (done) {
    var e = new Equality();
    var g = new Group();
    var d = { a: 'foo', b: 'foo' };
    var o = { a: 'data.a', b: 'data.b' };
    e.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });

  it('correctly returns an error if missing option a', function (done) {
    var e = new Equality();
    var g = new Group();
    var d = { a: 'foo', b: 'foo' };
    var o = { b: 'data.b' };
    e.test(d, g, o, function (err, passed) {
      assert(err);
      assert(!passed);
      done();
    });
  });

  it('correctly returns an error if missing option b', function (done) {
    var e = new Equality();
    var g = new Group();
    var d = { a: 'foo', b: 'foo' };
    var o = { a: 'data.b' };
    e.test(d, g, o, function (err, passed) {
      assert(err);
      assert(!passed);
      done();
    });
  });

  it('correctly returns false if test does not pass', function (done) {
    var e = new Equality();
    var g = new Group();
    var d = { a: 'foo', b: 'bar' };
    var o = { a: 'data.a', b: 'data.b' };
    e.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(!passed);
      done();
    });
  });

  // Tests else branch of if statement in test()
  it('correctly returns false if test does not pass', function (done) {
    var e = new Equality();
    var g = new Group();
    var d = { a: 'foo', b: 'bar' };
    var o = { a: 'data.a', b: 'data.bar' };
    e.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(!passed);
      done();
    });
  });
});

