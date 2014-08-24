# resource-mapper

A fast and router-agnostic resource mapper for generating pragmatic RESTful API routes.

## Install

```bash
npm install resource-mapper
```

## Quick start

```javascript
var ResourceMapper = require('resource-mapper');

// an example using ExpressJS router.
// See `Supported Routers` section below to see a list of supported routers
var router = require('express').Router();

var mapper = new ResourceMapper(router);

// map a collection resource
mapper.collection('users', {

    // retrieves a list of users
    list: function (req, res),      // GET  /users
    
    // creates a new user
    create: function (req, res),    // POST /users
    
    // retrieves a specific user
    show: function (req, res),      // GET  /users/:id
    
    // edit an existing user
    edit: function (req, res),      // PUT  /users/:id 
    
    // partially update an existing user
    update: function (req, res),    // PATCH  /users/:id
    
    // deletes an existing user
    destroy: function (req, res),   // DELETE /users/:id
});

// map a singleton resource
mapper.singleton('account', {

    // retrieves account singleton
    show: function (req, res),      // GET  /account
    
    // an alias to `show`
    list: function (req, res),      // GET  /account
    
    // create account
    create: function (req, res),    // POST /account
    
    // edit account
    edit: function (req, res),      // PUT  /account
    
    // partially update account
    update: function (req, res),    // PATCH  /account
    
    // deletes account
    destroy: function (req, res),   // DELETE /account
});
```

## Supported Routers

Basically, this library supports any router that uses that following interface for routing:

```javascript
router.get(path, handler);
router.post(path, handler);
router.put(path, handler);
router.patch (path, handler);
router.delete(path, handler);
router.del(path, handler);
// where `handler` is the function that gets executed when a route pattern matches
```

A list of supported routers and example usage

| Router | Example |
|:-------|:--------|
| [expressjs](https://github.com/strongloop/express) | \- |
| [director](https://github.com/flatiron/director) | \- |
| [node-simple-router](https://github.com/sandy98/node-simple-router) | \- |
| [router](https://github.com/gett/router) | \- |
| [choreographer](https://github.com/laughinghan/choreographer) | \- |

## Concepts

Resources: Collections vs Singleton

Pragmatic RESTful APIs

## Tests

```bash
npm test
```

Note: Requires [mocha](http://visionmedia.github.io/mocha/) to be installed

```bash
[sudo] npm install mocha -g
```

## Known Issues


## Links
* [twitter.com/sogko](https://twitter.com/sogko)
* [github.com/sogko](https://github.com/sogko)
* [medium.com/@sogko](https://medium.com/@sogko)

## License
Copyright (c) 2014 Hafiz Ismail. This software is licensed under the [MIT License](https://github.com/sogko/node-resource-mapper/raw/master/LICENSE).
