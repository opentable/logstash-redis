var logstashRedis = require('../lib/logstash-redis');
var should = require('should');

describe('LogstashRedis', function(){

  it('should implement proper constructors', function(done){
    logstashRedis.createNullLogger.should.be.type('function');
    logstashRedis.createLogger.should.be.type('function');
    done();
  })
})
