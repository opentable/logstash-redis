var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');

var LogstashRedis = require('../lib/logger');

var subscribers;
var buildFakeRedisClient = function(){
  
  var client;

  client = {
    createClient: sinon.stub(),
    on: null,
    quit: sinon.spy(),
    rpush: sinon.stub().yields('called')
  };

  subscribers = {};
  client.createClient.returns(client);

  client.on = function(eventName, subscriber){
    if(!subscribers[eventName]){
      subscribers[eventName] = [];
    }

    subscribers[eventName].push(subscriber);
    return client;   
  };

  return client;
};

var fireClientEvent = function(name, eventData){
  if(!!subscribers && !!subscribers[name]){
    for(var i = 0; i < subscribers[name].length; i++){
      subscribers[name][i](eventData);
    }
  }
};

describe('LogstashRedis', function(){

  var fakeClient;
  beforeEach(function(){
    fakeClient = buildFakeRedisClient();
  });

  it('should init a new session with the correct parameters', function(){
    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key');

    expect(fakeClient.createClient.called).to.be.true;
    expect(fakeClient.createClient.args[0]).to.eql([1234, '127.0.0.89']);
  });

  it('should log with the correct key', function(done){
    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key');

    logger.log({}, function(){
      expect(fakeClient.rpush.called).to.be.true;
      expect(fakeClient.rpush.args[0][0]).to.eql('key');
      done();
    });
  });

  it('should log with the correct key and data when initialised with a null base object', function(done){
    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key');

    var myData = { aProperty: 'someValue' };

    logger.log(myData, function(){
      expect(fakeClient.rpush.args[0][0]).to.eql('key');
      expect(fakeClient.rpush.args[0][1]).to.eql(JSON.stringify({ aProperty: 'someValue' }));
      done();
    });
  });

  it('should log with the correct key and data when initialised with a base object', function(done){
    var myData = { b: 'someValue' };
    var myData2 = { c: 'someDifferentValue' };

    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key', { a: 1234 });

    logger.log(myData, function(){
      logger.log(myData2, function(){

        expect(fakeClient.rpush.args.length).to.be.eql(2);
        expect(fakeClient.rpush.args[0][0]).to.be.eql('key');
        expect(fakeClient.rpush.args[0][1]).to.be.eql(JSON.stringify({
          a: 1234,
          b: 'someValue'
        }));
        expect(fakeClient.rpush.args[1][0]).to.be.eql('key');
        expect(fakeClient.rpush.args[1][1]).to.be.eql(JSON.stringify({
          a: 1234,
          c: 'someDifferentValue'
        }));

        done();
      });
    });
  });

  it('should log with the correct key and data when initialised with a base function', function(done){

    var c = 0;
    var baseFunction = function(){
      c++;
      return {
        x: 1234,
        y: c
      };
    };

    var myData = { a: 'someValue' };
    var myData2 = { b: 'someOtherValue' };

    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key', baseFunction);

    logger.log(myData, function(){
      logger.log(myData2, function(){

        expect(fakeClient.rpush.args[0][0]).to.be.eql('key');
        expect(JSON.parse(fakeClient.rpush.args[0][1])).to.be.eql({
          a: 'someValue',
          x: 1234,
          y: 1
        });
        expect(fakeClient.rpush.args[1][0]).to.be.eql('key');
        expect(JSON.parse(fakeClient.rpush.args[1][1])).to.be.eql({
          b: 'someOtherValue',
          x: 1234,
          y: 2
        });

        done();
      });
    });
  });

  it('should emit an error event when the redis library emits an error event', function(){
    var logger = new LogstashRedis(fakeClient, '127.0.0.14', 3423, 'logKey');
    var errorCb = sinon.spy();

    logger.onError(errorCb);

    fireClientEvent('error', { errorDetails: 'hello' });

    expect(errorCb.called).to.be.true;
    expect(errorCb.args[0][0]).to.eql({ errorDetails: 'hello' });
  });

  it('should close the connection', function(){
    var logger = new LogstashRedis(fakeClient, '127.0.0.89', 1234, 'key');
    logger.close();

    expect(fakeClient.quit.called).to.be.true;
  });
});
