var Promise = require('bluebird');
var promiseToStreamEither = require('./index');
var $ = require('sanctuary');
var S = $.create({ checkTypes: false, env: $.env });
var flyd = require('flyd');
var assert = require('assert');

var toThrow = function() {
  throw new Error('fail');
};

var toPromise = function(p) {
  return new Promise(function(resolve, reject) {
    flyd.on(resolve, promiseToStreamEither(p));
  });
};

var resolvedPromiseToRight = function() {
  return toPromise(Promise.resolve(1))
  .then(function(either) {
    S.either(toThrow, function(v) {
      assert.equal(v, 1);
    }, either);
  });
};

var rejectedPromiseToLeft = function() {
  return toPromise(Promise.reject(new Error('an error')))
  .then(function(either) {
    S.either(function(error) {
      assert.equal(error.message, 'an error');
    }, toThrow, either);
  });
};

describe('promiseToStreamEither', function() {
  it('rejectedPromiseToLeft', rejectedPromiseToLeft);
  it('resolvedPromiseToRight', resolvedPromiseToRight);
});
