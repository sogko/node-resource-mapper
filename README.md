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

## API

### var mapper = new ResourceMapper(router)
Creates a new instance of ResourceMapper with given router object.
See [Supported Routers](#supported-routers) to see a list of supported routers

### Collection: mapper.collection(name, map)
Creates a resource collection. 

A perfect use-case for a resource collection would be a **Post** collection.

Returns a new instance of ResourceMapper with its basePath pointed to this current collection, for e.g "/posts"

```name``` is the given resource name, which will be used for the RESTful API route.
```map``` is the list of resource actions to controllers.


### Singleton: mapper.singleton(name, map)
Creates a resource singleton. 

A perfect use-case for a resource collection would be an **Account** resource. Only one Account singleton exists within the application context, in this example. 

Returns a new instance of ResourceMapper with its basePath pointed to this current collection, for e.g "/account"

```name``` is the given resource name, which will be used for the RESTful API route.
```map``` is the list of resource actions to controllers.

### Nested / sub-collections
The library allows you to create a sub-collection.

For e.g. to create a ```user``` collection with ```posts``` sub-collection to represent each user resource having a collection of ```posts```

```javascript
...
var mapper = new ResourceMapper(router);

var users = mapper.collection('users', {
    list: function (req, res),      // GET  /users
    create: function (req, res),    // POST /users
    show: function (req, res),      // GET  /users/:id
    edit: function (req, res),      // PUT  /users/:id 
    update: function (req, res),    // PATCH  /users/:id
    destroy: function (req, res),   // DELETE /users/:id
});

var posts = users.collection('posts', {
    list: function (req, res),      // GET  /users/:id/posts
    create: function (req, res),    // POST /users/:id/posts
    show: function (req, res),      // GET  /users/:id/posts/:id
    edit: function (req, res),      // PUT  /users/:id/posts/:id 
    update: function (req, res),    // PATCH  /users/:id/posts/:id
    destroy: function (req, res),   // DELETE /users/:id/posts/:id
});
```

A ```sub-collection``` can be either a ```collection``` or a ```singleton```.

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

### Resources: Collections vs Singleton vs Sub-collections


A ```resource``` is a fundamental concept in any RESTful api.

A ```collection``` is well, simply a collection of resources. A good example of a collection would be a ```Posts``` collection of ```Post``` resource.

A ```singleton``` is to model a resource that only exists once in itself within a given context.
For example, in your web application context, you might want to model a ```account``` resource for your web app.

A ```sub-collection``` is a simply a resource (either a collection or singleton resource) that exists within another resource. It usually used to express relationships between resources.


A great read at: http://restful-api-design.readthedocs.org/en/latest/resources.html


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
