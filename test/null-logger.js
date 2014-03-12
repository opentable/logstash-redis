var LogstashRedis = require('../lib/index');
var should = require('should');

describe('The NullLogger', function(){

  it('should implement proper functions that do nothing', function(done){

    var logger = LogstashRedis.createNullLogger();

    logger.log.should.be.type('function');
    logger.close.should.be.type('function');

    done();
  });
});