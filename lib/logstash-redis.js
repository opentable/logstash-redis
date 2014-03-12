var _ = require('underscore');

module.exports = function(redisClient, redisHost, redisPort, key, base){

  this.key = key;
  this.base = base;
  this.client = redisClient.createClient(redisPort, redisHost).on('error', console.log);

  return _.extend(this, {
    getLogObject: function(data){
      var baseObject = (typeof(this.base) === 'function' ? this.base() : (this.base || {}));
      
      return _.extend(_.clone(baseObject), data);
    },
    log: function(data, callback){
      this.client.rpush(this.key, JSON.stringify(this.getLogObject(data)), callback);
    },
    close: function(callback){
      this.client.quit(callback);
    }
  });
};