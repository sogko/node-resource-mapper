'use strict';

var _ = require('lodash');
var path = require('path');

var RESTfulMap = {
  list:     { verb: 'get', hasIdParam: false },
  create:   { verb: 'post', hasIdParam: false },
  show:     { verb: 'get', hasIdParam: true },
  edit:     { verb: 'put', hasIdParam: true },
  update:   { verb: 'patch', hasIdParam: true },
  destroy:  { verb: 'delete', hasIdParam: true }
};
var RESTfulVerbs = ['get', 'post', 'put', 'patch', 'delete'];

var ResourceMapper = module.exports = function ResourceMapper(router, opts) {
  if (!(this instanceof ResourceMapper)) { return new ResourceMapper(router, opts); }
  // side effect: modifies 'router' object
  this.router = router;
  this.options = _.assign({
    basePath: '/',
    idParamName: ':id'
  }, opts);
  return this;
};

function _generateRoutes(type, resourcePath, resourceMap, opts) {
  var results = [];
  _.forEach(resourceMap, function (controller, name) {
    if (_.has(RESTfulMap, name)) {
      return results.push({
        verb: RESTfulMap[name].verb,
        path: (type === 'singleton') ? resourcePath : path.join(resourcePath, (RESTfulMap[name].hasIdParam) ? opts.idParamName : ''),
        fn: controller
      });
    }
    // else custom resource actions
    var custom = controller;
    if (_.isFunction(custom)) { custom = { name: name, get: custom }; }
    if (!_.isPlainObject(custom)) { return; }

    custom.name = custom.name || name;
    _.forEach(custom, function (func, verb) {
      // check if verb is RESTful
      if (_.indexOf(RESTfulVerbs, verb) < 0) { return; }
      results.push({
        verb: verb,
        path: (type === 'singleton') ? path.join(resourcePath, custom.name) : path.join(resourcePath, opts.idParamName, custom.name),
        fn: func
      });
    });
  });
  return results;
}
function _addRoute(router, verb, path, fn) {
  if (typeof router[verb] === 'function') {
    return router[verb](path, fn);
  }
  // handle case where router has router.del() instead of router.delete() interface
  if (verb === 'delete' && typeof router['del'] === 'function') {
    return router['del'](path, fn);
  }
  // throw an error if router does not support HTTP verb
  throw(new Error(['HTTP verb \'', verb.toUpperCase(), '\' not supported by router'].join('')));
}
ResourceMapper.prototype._mapResource = function _mapResource(type, resourceName, resourceMap, opts) {
  var options = _.assign(_.clone(this.options), opts);
  var resourcePath = path.join('/', options.basePath, resourceName);
  var routes = _generateRoutes(type, resourcePath, resourceMap, options);
  _.forEach(routes, function (r) {
    _addRoute(this.router, r.verb, r.path, r.fn);
  }.bind(this));
  options.basePath = (type === 'singleton') ? resourcePath : path.join(resourcePath, options.idParamName);
  return new ResourceMapper(this.router, options);
};

ResourceMapper.prototype.collection = function collection(resourceName, resourceMap, opts) {
  return this._mapResource('collection', resourceName, resourceMap, opts);
};

ResourceMapper.prototype.singleton = function singleton(resourceName, resourceMap, opts) {
  return this._mapResource('singleton', resourceName, resourceMap, opts);
};