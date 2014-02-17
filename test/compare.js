var assert  = require('assert');
var Compare = require('../lib/compare');
var Group   = require('../lib/group');

describe('Compare', function () {
  it('correctly reports it\'s name', function () {
    assert.equal(Compare.getName(), 'compare');
  });

  it('correctly tests less than', function (done) {
    var c = new Compare();
    var g = new Group();
    var d = { a: 10, b: 15 };
    var o = { lessThan: { a: 'data.a', b: 'data.b' } };

    c.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(passed);

      d.b = 5;
      c.test(d, g, o, function (err, passed) {
        assert(!err);
        assert(!passed);
        done();
      });
    });
  });

  it('correctly tests less than or equal', function (done) {
    var c = new Compare();
    var g = new Group();
    var d = { a: 10, b: 15 };
    var o = { lessThanEqual: { a: 'data.a', b: 'data.b' } };

    c.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(passed);

      d.b = 10;
      c.test(d, g, o, function (err, passed) {
        assert(!err);
        assert(passed);

        d.b = 5;
        c.test(d, g, o, function (err, passed) {
          assert(!err);
          assert(!passed);
          done();
        });
      });
    });
  });

  it('correctly tests greater than', function (done) {
    var c = new Compare();
    var g = new Group();
    var d = { a: 15, b: 10 };
    var o = { greaterThan: { a: 'data.a', b: 'data.b' } };

    c.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(passed);

      d.b = 30;
      c.test(d, g, o, function (err, passed) {
        assert(!err);
        assert(!passed);
        done();
      });
    });
  });

  it('correctly tests greater than or equal', function (done) {
    var c = new Compare();
    var g = new Group();
    var d = { a: 15, b: 10 };
    var o = { greaterThanEqual: { a: 'data.a', b: 'data.b' } };

    c.test(d, g, o, function (err, passed) {
      assert(!err);
      assert(passed);

      d.b = 15;
      c.test(d, g, o, function (err, passed) {
        assert(!err);
        assert(passed);

        d.b = 30;
        c.test(d, g, o, function (err, passed) {
          assert(!err);
          assert(!passed);
          done();
        });
      });
    });
  });

  it('correctly reports invalid tests', function (done) {
    var c = new Compare();
    var g = new Group();
    var d = { a: 15, b: 10 };
    var o = { foobar: { a: 'data.a', b: 'data.b' } };

    c.test(d, g, o, function (err, passed) {
      assert(err);
      assert(!passed);
      done();
    });
  });
});

