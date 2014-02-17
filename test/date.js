var assert   = require('assert');
var Datetime = require('../lib/date');
var Group    = require('../lib/group');

describe('Date', function () {
  it('correctly reports it\'s name', function () {
    assert.equal(Datetime.getName(), 'datetime');
  });

  it('correctly passes date later than x', function (done) {
    var d = new Datetime();
    var g = Group();
    var data = {
      date: Date.now() - 1000 * 3600 // an hour ago
    };
    var options = {
      dateName: 'date',
      after: Date.now() - 1000 * 3600 * 2
    };

    d.test(data, g, options, function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });

  it('correctly passes date earlier than x', function (done) {
    var d = new Datetime();
    var g = Group();
    var data = {
      date: Date.now() - 1000 * 3600 // an hour ago
    };
    var options = {
      dateName: 'date',
      before: Date.now() + 1000 * 3600 * 2
    };

    d.test(data, g, options, function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });

  it('correctly passes date in range', function (done) {
    var d = new Datetime();
    var g = Group();
    var data = {
      date: Date.now() - 1000 * 3600 // an hour ago
    };
    var options = {
      dateName: 'date',
      after: Date.now() - 1000 * 3600 * 2,
      before: Date.now() + 1000 * 3600 * 2
    };

    d.test(data, g, options, function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });

  it('correctly marks test as not applicable if missing date', function (done) {
    var d = new Datetime();
    var g = Group();
    var data = { };
    var options = {
      dateName: 'date',
      after: Date.now() - 1000 * 3600 * 2,
      before: Date.now() + 1000 * 3600 * 2
    };

    d.test(data, g, options, function (err, passed) {
      assert(!err);
      assert(!passed);
      done();
    });
  });

  it('correctly returns an error if date is invalid', function (done) {
    var d = new Datetime();
    var g = Group();
    var data = { date: 'invalid date' };
    var options = {
      dateName: 'date',
      after: Date.now() - 1000 * 3600 * 2,
      before: Date.now() + 1000 * 3600 * 2
    };

    d.test(data, g, options, function (err, passed) {
      assert(err);
      assert(!passed);
      done();
    });
  });
});

