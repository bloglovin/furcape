var assert     = require('assert');
var Percentage = require('../lib/percentage');
var Group      = require('../lib/group');

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

  // Input data will yield a `grp` of one in `test()`.
  it('correctly tests an object', function (done) {
    var p = new Percentage();
    var g = Group();
    g.uuid = 'foobarz';

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
});

