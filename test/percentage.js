var assert     = require('assert');
var Percentage = require('../lib/percentage');
var Group      = require('../lib/group');
var async      = require('async');

describe('Percentage', function () {
  it('correctly reports it\'s name', function () {
    assert.equal(Percentage.getName(), 'percentage');
  });

  it('correctly creates hash', function () {
    var p = new Percentage();
    var g = Group();

    var data = {
      id: 10,
      username: 'foobar'
    };

    var options = {
      hashProps: ['data.username', 'group.uuid'],
    };

    var hash = p._createHashString(data, g, options);
    assert.equal(hash, data.username + g.uuid);
  });

  it('correctly creates a checksum', function () {
    var p = new Percentage();
    var i = p._createChecksum('foo');
    // I know for a fact that the first three bytes of the sha1-hash for
    // 'foo' is 11, 238 and 199.
    assert.equal(i, 11 + 238*Math.pow(2, 8) + 199*Math.pow(2, 16));
  });

  it('correctly tests an object', function (done) {
    var p = new Percentage();
    var g = Group();
    g.uuid = 'foo';

    var data = {
      id: 10,
      username: 'foobar'
    };

    var options = {
      hashProps: ['data.username', 'group.uuid'],
      percent: 10
    };

    p.test(data, g, options, function (err, passed) {
      assert(!err);
      assert(passed);
      done();
    });
  });

  it('correctly distributes groups', function (done) {
    this.timeout(10 * 1000);
    var p = new Percentage();
    var g = Group();
    var options = {
      hashProps: ['data.id', 'group.uuid'],
      percent: 10
    };

    // Generate a ton of tests
    var tests = [];
    function test() {
      var data = { id: Math.random() * 1000 + Date.now() / Math.random() };
      return function (fn) {
        p.test(data, g, options, fn);
      };
    }

    var count = 50000;
    for (var i = 0; i < count; i++) {
      tests.push(test());
    }

    // Run tests and calculate the spread
    async.parallel(tests, function (err, result) {
      assert(!err);
      var passed  = result.filter(function (i) { return i; });
      var percent = (passed.length / count) * 100;
      var errorMargin = 0.5;
      var lowerBounds = options.percent - errorMargin;
      var upperBounds = options.percent + errorMargin;
      assert(percent > lowerBounds && percent < upperBounds);
      done();
    });
  });
});

