var LogstashRedis = require('./logstash-redis');
var redis   = require('redis');

module.exports = function(redisHost, redisPort, key, base){
  return new LogStashRedis(redis, redisHost, redisPort, key, base);
};