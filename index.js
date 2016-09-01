var flyd = require('flyd');
var $ = require('sanctuary');
var S = $.create({ checkTypes: false, env: $.env });

var noop = function() {};

module.exports = function(promise) {
  var s = flyd.stream();
  promise.then(function(a) {
    s(S.Right(a));
    s.end(true);
  }).catch(noop);

  promise.catch(function(error) {
    s(S.Left(error));
    s.end(true);
  });

  return s;
};
