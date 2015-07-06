var expect = require('chai').expect;
var logstashRedis = require('../lib/logstash-redis');

describe('LogstashRedis', function(){

  it('should implement proper constructors', function(){
    expect(typeof(logstashRedis.createNullLogger)).to.equal('function');
    expect(typeof(logstashRedis.createLogger)).to.equal('function');
  });
});