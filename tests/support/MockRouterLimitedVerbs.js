'use strict';
/**
 * MockRouterLimitedVerbs has a similar to express.Router() interfaces.
 * It has a `routes` property that keep tracks of routes added to the router.
 *
 * Difference between MockRouterLimitedVerbs and MockRouter:
 * - does not support PATCH verb
 * @type {exports}
 */
var MockRouterLimitedVerbs = module.exports = function () {
  this.routes = [];
};
MockRouterLimitedVerbs.prototype.add = function add(verb) {
  return (function fn(path, func) {
    this.routes.push({
      verb: verb,
      path: path,
      fn: func
    });
  }.bind(this));
};
MockRouterLimitedVerbs.prototype.get = function (path, func) {
  return this.add('get')(path, func);
};
MockRouterLimitedVerbs.prototype.post = function (path, func) {
  return this.add('post')(path, func);
};
MockRouterLimitedVerbs.prototype.put = function (path, func) {
  return this.add('put')(path, func);
};
MockRouterLimitedVerbs.prototype.delete = function (path, func) {
  return this.add('delete')(path, func);
};