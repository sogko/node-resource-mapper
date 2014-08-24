'use strict';
/**
 * MockAnotherRouter has a similar to express.Router() interfaces.
 * It has a `routes` property that keep tracks of routes added to the router.
 *
 * Difference between MockAnotherRouter and MockRouter:
 * - instead of delete(), it has a del() interface
 * @type {exports}
 */
var MockAnotherRouter = module.exports = function () {
  this.routes = [];
};
MockAnotherRouter.prototype.add = function add(verb) {
  return (function fn(path, func) {
    this.routes.push({
      verb: verb,
      path: path,
      fn: func
    });
  }.bind(this));
};
MockAnotherRouter.prototype.get = function (path, func) {
  return this.add('get')(path, func);
};
MockAnotherRouter.prototype.post = function (path, func) {
  return this.add('post')(path, func);
};
MockAnotherRouter.prototype.put = function (path, func) {
  return this.add('put')(path, func);
};
MockAnotherRouter.prototype.patch = function (path, func) {
  return this.add('patch')(path, func);
};
MockAnotherRouter.prototype.del = function (path, func) {
  return this.add('delete')(path, func);
};