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

Ths simple way:
```js
var LogstashRedis = require('logstash-redis');

var logger = new LogstashRedis('127.0.0.1', 6379, 'key');

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

Using a base object for each log:
```js
var LogstashRedis = require('logstash-redis');

var logger = new LogstashRedis('127.0.0.1', 6379, 'key', { type: 'someValue', env: "prod-1234" });

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

Using a base function for each log:
```js
var LogstashRedis = require('logstash-redis');

var baseFunction = function(){
  type: 'someValue',
  meta: {
    time: new Data().toISOString(),
    host: require('os').hostname()
  }
};

var logger = new LogstashRedis('127.0.0.1', 6379, 'key', baseFunction);

logger.log({ a: 1234, b: 'hello' });

logger.close();
```

### new (host, port, key, [base object/function])

Initiate a Redis connection, prepares the base log object.

### log(data, [callback])

Logs some data asynchronously. Data is a valid javascript object.

### close([callback]);

Properly closes the Redis connection.
  
# Tests

```shell
npm test
```

# License

MIT