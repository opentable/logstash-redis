var Logger = require('./logger');
var redis   = require('redis');

module.exports = {
  createLogger: function(redisHost, redisPort, key, base){
    return new Logger(redis, redisHost, redisPort, key, base);
  },
  createNullLogger: function(){
    this.close = function(){};
    this.log = function(){};
    this.onError = function(){};

    return this;
  }
};
