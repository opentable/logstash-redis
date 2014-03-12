logstash-redis
=============

Uber simple Logstash logging using Redis

Node version: **0.8.0** required

Build status: [![Build Status](https://secure.travis-ci.org/opentable/logstash-redis.png?branch=master)](http://travis-ci.org/opentable/logstash-redis)

[![NPM](https://nodei.co/npm/logstash-redis.png?downloads=true)](https://npmjs.org/package/logstash-redis)

# Installation

```shell
npm install logstash-redis
```

# Usage

The simple way:
```js
var LogstashRedis = require('logstash-redis');

var logger = new LogstashRedis('127.0.0.1', 6379, 'key');

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

Using a base object for each log:
```js
var LogstashRedis = require('logstash-redis');

var baseObject = {
  type: 'someValue',
  env: "prod-1234"
};

var logger = new LogstashRedis('127.0.0.1', 6379, 'key', baseObject);

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

Using a base function for each log:
```js
var LogstashRedis = require('logstash-redis');

var baseFunction = function(){
  return  {
    type: 'someValue',
    meta: {
      timestamp: new Date().toISOString(),
      host: require('os').hostname()
    }
  };
};

var logger = new LogstashRedis('127.0.0.1', 6379, 'key', baseFunction);

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

### new (host, port, key, [base])

Initiate a Redis connection. When the `base` parameter is specified, it is used as a base for each log object. It can be an object or a function.

### log(data, [callback])

Logs some data asynchronously. Data is a valid javascript object. If a base object or function had been provided during initialisation, data will extend it.

### close([callback]);

Cleanly closes the Redis connection (all replies will be parsed).

# The NullLogger

It does exactly nothing. Good for testing.
```js
var LogstashRedis = require('logstash-redis');

var logger = LogstashRedis.createNullLogger();

logger.log({ a: 1234, b: 'hello' });
// does nothing

logger.close();
// does nothing
```

# Tests

```shell
npm test
```

# License

MIT

# Contributors

* [@ArnoldZokas](https://github.com/ArnoldZokas)
* [@gondar](https://github.com/gondar)
