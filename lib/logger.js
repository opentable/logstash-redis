var _ = require('underscore');

module.exports = function(redisClient, redisHost, redisPort, key, base){

  var subscribers = {
    error: []
  };

  this.key = key;
  this.base = base;
  this.client = redisClient.createClient(redisPort, redisHost);
  
  this.client.on('error', function(data){
    for(var i = 0; i < subscribers.error.length; i++){
      subscribers.error[i](data);
    }
  });

  return _.extend(this, {
    close: function(callback){
      this.client.quit(callback);
    },
    getLogObject: function(data){
      var baseObject = (typeof(this.base) === 'function' ? this.base() : (this.base || {}));
      
      return _.extend(_.clone(baseObject), data);
    },
    log: function(data, callback){
      this.client.rpush(this.key, JSON.stringify(this.getLogObject(data)), callback);
    },
    onError: function(subscriber){
      subscribers.error.push(subscriber);
    }
  });
};