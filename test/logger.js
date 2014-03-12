var LogstashRedis = require('../lib/logger');
var should = require('should');
var _ = require('underscore');

var FakeRedisClient = function(){
  this.parameters = {
    host: null,
    port: null,
    log: [],
    closed: false
  };

  return _.extend(this, {
    createClient: function(port, host){
      this.parameters.host = host;
      this.parameters.port = port;

      return this;
    },
    on: function(){
      return this;
    },
    rpush: function(key, data, callback){
      this.parameters.log.push([key, data]);
      callback();
    },
    quit: function(){
      this.parameters.closed = true;
    }
  });
};


describe('LogstashRedis', function(){

  it('should init a new session with the correct parameters', function(done){
    var fakeRedisClient = new FakeRedisClient();

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key');

    fakeRedisClient.parameters.host.should.be.eql('127.0.0.89');
    fakeRedisClient.parameters.port.should.be.eql(1234);

    done();
  });

  it('should log with the correct key', function(done){
    var fakeRedisClient = new FakeRedisClient();

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key');

    logger.log({}, function(){
      fakeRedisClient.parameters.log.length.should.be.eql(1);
      fakeRedisClient.parameters.log[0][0].should.be.eql('key');
      done();
    });
  });

  it('should log with the correct key and data when initialised with a null base object', function(done){
    var fakeRedisClient = new FakeRedisClient();

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key');

    var myData = { aProperty: 'someValue' };

    logger.log(myData, function(){
      fakeRedisClient.parameters.log.length.should.be.eql(1);
      fakeRedisClient.parameters.log[0][0].should.be.eql('key');
      JSON.parse(fakeRedisClient.parameters.log[0][1]).should.be.eql(myData);
      done();
    });
  });

  it('should log with the correct key and data when initialised with a base object', function(done){
    var fakeRedisClient = new FakeRedisClient();
    var myData = { b: 'someValue' };
    var myData2 = { c: 'someDifferentValue' };

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key', { a: 1234 });

    logger.log(myData, function(){
      logger.log(myData2, function(){
        fakeRedisClient.parameters.log.length.should.be.eql(2);
        fakeRedisClient.parameters.log[0][0].should.be.eql('key');
        JSON.parse(fakeRedisClient.parameters.log[0][1]).should.be.eql({
          a: 1234,
          b: 'someValue'
        });
        fakeRedisClient.parameters.log[1][0].should.be.eql('key');
        JSON.parse(fakeRedisClient.parameters.log[1][1]).should.be.eql({
          a: 1234,
          c: 'someDifferentValue'
        });
        done();
      });
    });
  });

  it('should log with the correct key and data when initialised with a base function', function(done){
    var fakeRedisClient = new FakeRedisClient();

    var functionCallCounter = 0;
    var baseFunction = function(){
      functionCallCounter++;
      return {
        x: 1234,
        y: functionCallCounter
      };
    };
    var myData = { a: 'someValue' };
    var myData2 = { b: 'someOtherValue' };

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key', baseFunction);

    logger.log(myData, function(){
      logger.log(myData2, function(){
        fakeRedisClient.parameters.log.length.should.be.eql(2);
        fakeRedisClient.parameters.log[0][0].should.be.eql('key');
        JSON.parse(fakeRedisClient.parameters.log[0][1]).should.be.eql({
          a: 'someValue',
          x: 1234,
          y: 1
        });
        fakeRedisClient.parameters.log[1][0].should.be.eql('key');
        JSON.parse(fakeRedisClient.parameters.log[1][1]).should.be.eql({
          b: 'someOtherValue',
          x: 1234,
          y: 2
        });
        functionCallCounter.should.be.eql(2);
        done();
      });
    });
  });

  it('should close the connection', function(done){
    var fakeRedisClient = new FakeRedisClient();

    var logger = new LogstashRedis(fakeRedisClient, '127.0.0.89', 1234, 'key');
    logger.close();

    fakeRedisClient.parameters.closed.should.be.true;
    done();
  });
});
