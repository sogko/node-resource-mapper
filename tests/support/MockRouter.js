'use strict';
/**
 * MockRouter has a similar to express.Router() interfaces
 * It has a `routes` property that keep tracks of routes added to the router.
 * @type {exports}
 */
var MockRouter = module.exports = function () {
  this.routes = [];
};
MockRouter.prototype.add = function add(verb) {
  return (function fn(path, func) {
    this.routes.push({
      verb: verb,
      path: path,
      fn: func
    });
  }.bind(this));
};
MockRouter.prototype.get = function (path, func) {
  return this.add('get')(path, func);
};
MockRouter.prototype.post = function (path, func) {
  return this.add('post')(path, func);
};
MockRouter.prototype.put = function (path, func) {
  return this.add('put')(path, func);
};
MockRouter.prototype.patch = function (path, func) {
  return this.add('patch')(path, func);
};
MockRouter.prototype.delete = function (path, func) {
  return this.add('delete')(path, func);
};