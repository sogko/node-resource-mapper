'use strict';

var expect = require('chai').expect;
var _ = require('lodash');
var ResourceMapper = require('../../index');
var MockRouter = require('../support/MockRouter');
var MockAnotherRouter = require('../support/MockAnotherRouter');
var MockRouterLimitedVerbs = require('../support/MockRouterLimitedVerbs');

var router;
var stubController = function () {
};

function runnerCollection(dataBase, data) {
  _.forEach(data, function (d) {
    var input = _.assign({}, dataBase, { resource: d.resource, opts: d.opts });
    it(d.message, function (done) {
      new ResourceMapper(router).collection(input.name, input.resource, input.opts);
      if (d.expected) {
        expect(router.routes.length).to.equal(1);
        expect(router.routes[0]).to.eql(d.expected);
      } else {
        expect(router.routes.length).to.equal(0);
      }
      done();
    });
  });
}
function runnerSingleton(dataBase, data) {
  _.forEach(data, function (d) {
    var input = _.assign({}, dataBase, { resource: d.resource, opts: d.opts });
    it(d.message, function (done) {
      new ResourceMapper(router).singleton(input.name, input.resource, input.opts);
      if (d.expected) {
        expect(router.routes.length).to.equal(1);
        expect(router.routes[0]).to.eql(d.expected);
      } else {
        expect(router.routes.length).to.equal(0);
      }
      done();
    });
  });
}

describe('Unit: ResourceMapper', function () {

  var dataBase = {
    name: 'name',
    resource: {},
    opts: null
  };

  beforeEach(function (done) {
    router = new MockRouter();
    done();
  });

  describe('ResourceMapper()', function () {
    it('should be able to instantiate new object without `new`', function (done) {
      var obj = ResourceMapper(router);
      expect(obj).to.be.ok;
      done();
    });

    it('should be able to instantiate new object with `new`', function (done) {
      var obj = new ResourceMapper(router);
      expect(obj).to.be.ok;
      done();
    });
  });

  describe('ResourceMapper(router).collection(name, resource, opts)', function () {

    var data = [
      {
        resource: { list: stubController },
        expected: { verb: 'get', path: '/name', fn: stubController },
        message: 'should map resource.list to GET /name'
      },
      {
        resource: { create: stubController },
        expected: { verb: 'post', path: '/name', fn: stubController },
        message: 'should map resource.create to POST /name'
      },
      {
        resource: { show: stubController },
        expected: { verb: 'get', path: '/name/:id', fn: stubController },
        message: 'should map resource.show to GET /name/:id'
      },
      {
        resource: { edit: stubController },
        expected: { verb: 'put', path: '/name/:id', fn: stubController },
        message: 'should map resource.edit to PUT /name/:id'
      },
      {
        resource: { update: stubController },
        expected: { verb: 'patch', path: '/name/:id', fn: stubController },
        message: 'should map resource.update to PATCH /name/:id'
      },
      {
        resource: { destroy: stubController },
        expected: { verb: 'delete', path: '/name/:id', fn: stubController },
        message: 'should map resource.destroy to DELETE /name/:id'
      },
      {
        resource: { count: stubController },
        expected: { verb: 'get', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count to GET /name/:id/count'
      },
      {
        resource: { count: { get: stubController } },
        expected: { verb: 'get', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count.get to GET /name/:id/count'
      },
      {
        resource: { count: { post: stubController } },
        expected: { verb: 'post', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count.post to POST /name/:id/count'
      },
      {
        resource: { count: { put: stubController } },
        expected: { verb: 'put', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count.put to PUT /name/:id/count'
      },
      {
        resource: { count: { patch: stubController } },
        expected: { verb: 'patch', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count.patch to PATCH /name/:id/count'
      },
      {
        resource: { count: { delete: stubController } },
        expected: { verb: 'delete', path: '/name/:id/count', fn: stubController },
        message: 'should map resource.count.delete to DELETE /name/:id/count'
      },
      {
        resource: { count: { name: 'length', get: stubController } },
        expected: { verb: 'get', path: '/name/:id/length', fn: stubController },
        message: 'should map resource.count.get to GET /name/:id/length (specifed `name` option)'
      },
      {
        resource: { count: { unsupported: stubController } },
        expected: null,
        message: 'should not map resource.count.unsupported'
      },
      {
        resource: { show: stubController },
        opts: { type: 'singleton' },
        expected: { verb: 'get', path: '/name/:id', fn: stubController },
        message: 'should still be map to a collection'
      }
    ];

    describe('Default options', function () {
      runnerCollection(dataBase, data);
    });

    describe('Options: { type: \'collection\' } (should still be a singleton)', function () {
      var dataWithOptions = [];

      // add opts.type = 'singleton' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, { opts: { type: 'collection' } }));
      });
      runnerCollection(dataBase, dataWithOptions);
    });

    describe('Options: { idParamName: \':identifier\' }', function () {
      var dataWithOptions = [];

      // add opts.idParamName = ':identifier' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, {
          expected: (d.expected) ? _.assign({}, d.expected, { path: d.expected.path.replace(':id', ':identifier') }) : null,
          message: d.message.replace(':id', ':identifier'),
          opts: { idParamName: ':identifier' }
        }));
      });
      runnerCollection(dataBase, dataWithOptions);
    });

    describe('Options: { basePath: \'api\' }', function () {
      var dataWithOptions = [];

      // add opts.basePath = 'api' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, {
          expected: (d.expected) ? _.assign({}, d.expected, { path: d.expected.path.replace('/name', '/api/name') }) : null,
          message: d.message.replace('/name', '/api/name'),
          opts: { basePath: 'api' }
        }));
      });
      runnerCollection(dataBase, dataWithOptions);
    });


  });

  describe('ResourceMapper(router).singleton(name, resource, opts)', function () {

    var data = [
      {
        resource: { list: stubController },
        expected: { verb: 'get', path: '/name', fn: stubController },
        message: 'should map resource.list to GET /name'
      },
      {
        resource: { create: stubController },
        expected: { verb: 'post', path: '/name', fn: stubController },
        message: 'should map resource.create to POST /name'
      },
      {
        resource: { show: stubController },
        expected: { verb: 'get', path: '/name', fn: stubController },
        message: 'should map resource.show to GET /name'
      },
      {
        resource: { edit: stubController },
        expected: { verb: 'put', path: '/name', fn: stubController },
        message: 'should map resource.edit to PUT /name'
      },
      {
        resource: { update: stubController },
        expected: { verb: 'patch', path: '/name', fn: stubController },
        message: 'should map resource.update to PATCH /name'
      },
      {
        resource: { destroy: stubController },
        expected: { verb: 'delete', path: '/name', fn: stubController },
        message: 'should map resource.destroy to DELETE /name'
      },
      {
        resource: { count: stubController },
        expected: { verb: 'get', path: '/name/count', fn: stubController },
        message: 'should map resource.count to GET /name/count'
      },
      {
        resource: { count: { get: stubController } },
        expected: { verb: 'get', path: '/name/count', fn: stubController },
        message: 'should map resource.count.get to GET /name/count'
      },
      {
        resource: { count: { post: stubController } },
        expected: { verb: 'post', path: '/name/count', fn: stubController },
        message: 'should map resource.count.post to POST /name/count'
      },
      {
        resource: { count: { put: stubController } },
        expected: { verb: 'put', path: '/name/count', fn: stubController },
        message: 'should map resource.count.put to PUT /name/count'
      },
      {
        resource: { count: { patch: stubController } },
        expected: { verb: 'patch', path: '/name/count', fn: stubController },
        message: 'should map resource.count.patch to PATCH /name/count'
      },
      {
        resource: { count: { delete: stubController } },
        expected: { verb: 'delete', path: '/name/count', fn: stubController },
        message: 'should map resource.count.delete to DELETE /name/count'
      },
      {
        resource: { count: { name: 'length', get: stubController } },
        expected: { verb: 'get', path: '/name/length', fn: stubController },
        message: 'should map resource.count.get to GET /name/length (specifed `name` option)'
      },
      {
        resource: { count: { unsupported: stubController } },
        expected: null,
        message: 'should not map resource.count.unsupported'
      },
      {
        resource: { show: stubController },
        opts: { type: 'singleton' },
        expected: { verb: 'get', path: '/name', fn: stubController },
        message: 'should still be map to a collection'
      }
    ];

    describe('Default options', function () {
      runnerSingleton(dataBase, data);
    });

    describe('Options: { type: \'singleton\' } (should still be a collection)', function () {
      var dataWithOptions = [];

      // add opts.type = 'singleton' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, { opts: { type: 'singleton' } }));
      });
      runnerSingleton(dataBase, dataWithOptions);
    });

    describe('Options: { idParamName: \':identifier\' }', function () {
      var dataWithOptions = [];

      // add opts.idParamName = ':identifier' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, {
          expected: (d.expected) ? _.assign({}, d.expected, { path: d.expected.path.replace(':id', ':identifier') }) : null,
          message: d.message.replace(':id', ':identifier'),
          opts: { idParamName: ':identifier' }
        }));
      });
      runnerSingleton(dataBase, dataWithOptions);
    });

    describe('Options: { basePath: \'api\' }', function () {
      var dataWithOptions = [];

      // add opts.basePath = 'api' to each test
      _.forEach(data, function (d) {
        dataWithOptions.push(_.assign({}, d, {
          expected: (d.expected) ? _.assign({}, d.expected, { path: d.expected.path.replace('/name', '/api/name') }) : null,
          message: d.message.replace('/name', '/api/name'),
          opts: { basePath: 'api' }
        }));
      });
      runnerSingleton(dataBase, dataWithOptions);
    });


  });

  describe('Nested resources', function () {

    it('should be able to map a sub-collection to a collection', function (done) {
      var map = new ResourceMapper(router);
      var users = map.collection('users', {
        list: stubController,
        show: stubController
      });
      map.collection('posts', {
        list: stubController,
        show: stubController
      });
      users.collection('posts', {
        list: stubController,
        show: stubController
      });

      expect(router.routes.length).to.equal(6);
      expect(router.routes[0]).to.eql({
        verb: 'get',
        path: '/users',
        fn: stubController
      });
      expect(router.routes[1]).to.eql({
        verb: 'get',
        path: '/users/:id',
        fn: stubController
      });
      expect(router.routes[2]).to.eql({
        verb: 'get',
        path: '/posts',
        fn: stubController
      });
      expect(router.routes[3]).to.eql({
        verb: 'get',
        path: '/posts/:id',
        fn: stubController
      });
      expect(router.routes[4]).to.eql({
        verb: 'get',
        path: '/users/:id/posts',
        fn: stubController
      });
      expect(router.routes[5]).to.eql({
        verb: 'get',
        path: '/users/:id/posts/:id',
        fn: stubController
      });
      done();

    });
    it('should be able to map a sub-singleton to a collection', function (done) {
      var map = new ResourceMapper(router);
      var users = map.collection('users', {
        list: stubController,
        show: stubController
      });
      map.collection('posts', {
        list: stubController,
        show: stubController
      });
      users.singleton('settings', {
        show: stubController
      });

      expect(router.routes.length).to.equal(5);
      expect(router.routes[0]).to.eql({
        verb: 'get',
        path: '/users',
        fn: stubController
      });
      expect(router.routes[1]).to.eql({
        verb: 'get',
        path: '/users/:id',
        fn: stubController
      });
      expect(router.routes[2]).to.eql({
        verb: 'get',
        path: '/posts',
        fn: stubController
      });
      expect(router.routes[3]).to.eql({
        verb: 'get',
        path: '/posts/:id',
        fn: stubController
      });
      expect(router.routes[4]).to.eql({
        verb: 'get',
        path: '/users/:id/settings',
        fn: stubController
      });
      done();
    });

    it('should be able to map a sub-collection to a singleton', function (done) {
      var map = new ResourceMapper(router);
      var settings = map.singleton('settings', {
        show: stubController
      });
      settings.collection('options', {
        list: stubController,
        show: stubController
      });

      expect(router.routes.length).to.equal(3);
      expect(router.routes[0]).to.eql({
        verb: 'get',
        path: '/settings',
        fn: stubController
      });
      expect(router.routes[1]).to.eql({
        verb: 'get',
        path: '/settings/options',
        fn: stubController
      });
      expect(router.routes[2]).to.eql({
        verb: 'get',
        path: '/settings/options/:id',
        fn: stubController
      });
      done();
    });

    it('should be able to map a sub-singleton to a singleton', function (done) {
      var map = new ResourceMapper(router);
      var settings = map.singleton('settings', {
        show: stubController
      });
      settings.singleton('profile', {
        show: stubController,
        edit: stubController
      });

      expect(router.routes.length).to.equal(3);
      expect(router.routes[0]).to.eql({
        verb: 'get',
        path: '/settings',
        fn: stubController
      });
      expect(router.routes[1]).to.eql({
        verb: 'get',
        path: '/settings/profile',
        fn: stubController
      });
      expect(router.routes[2]).to.eql({
        verb: 'put',
        path: '/settings/profile',
        fn: stubController
      });
      done();
    });
  });

  describe('Router support', function () {
    it('should support router that has del() interface instead of delete()', function (done) {
      var router = new MockAnotherRouter();
      expect(router.delete).to.not.exist;
      expect(router.del).to.exist;

      var map = new ResourceMapper(router);
      var users = map.collection('users', {
        show: stubController,
        destroy: stubController
      });

      expect(router.routes.length).to.equal(2);
      expect(router.routes[0]).to.eql({
        verb: 'get',
        path: '/users/:id',
        fn: stubController
      });
      expect(router.routes[1]).to.eql({
        verb: 'delete',
        path: '/users/:id',
        fn: stubController
      });
      done();
    });

    it('should throw an exception if router does not support a verb', function (done) {
      var router = new MockRouterLimitedVerbs();

      // MockRouterLimitedVerbs does not support PATCH verb
      expect(router.patch).to.not.exist;

      var map = new ResourceMapper(router);
      var func = function () {
        map.collection('users', {
          show: stubController,
          destroy: stubController,
          update: stubController
        });
      };
      expect(func).to.throw(Error);
      done();
    });
  });
});