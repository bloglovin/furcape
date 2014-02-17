//
// # Util
//
// Some utility functions shared internally.
//

//
// ## Traverse
//
// Fetch an objects property using a dot-separated keypath.
//
module.exports.traverse = function traverse(keypath, obj) {
  var p = keypath.split('.');
  while (obj && p.length) {
    obj = obj[p.shift()];
  }
  return obj;
};

