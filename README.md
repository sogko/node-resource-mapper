# resource-mapper

A fast and router-agnostic resource mapper for generating pragmatic RESTful API routes.

## Install

```bash
npm install resource-mapper
```

## Quick start

```javascript
var ResourceMapper = require('resource-mapper');

// for example, using ExpressJS router.
// See 'Routers' section below to see a list of supported routers
var router = require('express').Router();

var mapper = new ResourceMapper(router);

// map a collection resource
mapper.collection('users', {
    list: function (req, res),      // GET  /users          (retrieves a list of users)
    create: function (req, res),    // POST /users          (creates a new user)
    show: function (req, res),      // GET  /users/:id      (retrieves a specific user)
    edit: function (req, res),      // PUT  /users/:id      (edit an existing user)
    update: function (req, res),    // PATCH  /users/:id    (partially update an existing user)
    destroy: function (req, res),   // DELETE /users/:id    (deletes an existing user)
});

// map a singleton resource
mapper.collection('account', {
    show: function (req, res),      // GET  /account      (retrieves account singleton)
    create: function (req, res),    // POST /account      (create account)
    edit: function (req, res),      // PUT  /account      (edit account)
    update: function (req, res),    // PATCH  /account    (partially update account)
    destroy: function (req, res),   // DELETE /account    (deletes account)
});
```

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
