var expect = require('chai').expect;
var LogstashRedis = require('../lib/logstash-redis');

describe('The NullLogger', function(){

  it('should implement proper functions that do nothing', function(){
    var logger = LogstashRedis.createNullLogger();

    expect(typeof(logger.close)).to.equal('function');
    expect(typeof(logger.log)).to.equal('function');
    expect(typeof(logger.onError)).to.equal('function');
  });
});
