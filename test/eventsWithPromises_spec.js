describe("subscription", function () {

  before(function (done) {
    var self = this;
    requirejs(['src/eventsWithPromises', 'jquery'], function (eventsWithPromises, $) {
      self.eventsWithPromises = eventsWithPromises;
      self.$ = $;
      done();
    }, done);

  });

  afterEach(function() {
    this.eventsWithPromises.unsubscribeAll();
  });

  it("adds a subscription if event name and callback supplied", function () {
    var spy = sinon.spy(),
        data = {
          key: 'value'
        };
    this.eventsWithPromises.subscribe('myEventType', spy);
    this.eventsWithPromises.publish('myEventType', data);
    sinon.assert.calledWith(spy, data);
  });

  
  it("removes a subscription if event name and context supplied", function () {
    var spy = sinon.spy(),
        myObj = {};
    this.eventsWithPromises.subscribe('myEventType', spy, myObj);
    this.eventsWithPromises.publish('myEventType');
    this.eventsWithPromises.unsubscribe('myEventType', myObj);
    this.eventsWithPromises.publish('myEventType');
    sinon.assert.calledOnce(spy);
  });

  it("executes the callback with a context if supplied", function () {
    var spy = sinon.spy(),
        myObj = {};
    this.eventsWithPromises.subscribe('myEventType2', spy, myObj);
    this.eventsWithPromises.publish('myEventType2');
    sinon.assert.calledOn(spy, myObj);
  });

  it("sends a promise to each listener if event is published with a promise", function (done) {
    this.eventsWithPromises.subscribe('myEvent', function (data, promise) {
      assert(promise !== null, 'Promise supplied to listener');
      done();
    });
    this.eventsWithPromises.publish('myEvent', null, this.$.Deferred());
  });

  describe("resolution of promises", function () {

    beforeEach(function (done) {
      this.promise = this.$.Deferred();
      this.eventsWithPromises.subscribe('myEvent', function (data, promise) {
        promise.resolve();
      });
      this.eventsWithPromises.subscribe('myEvent', function (data, promise) {
        promise.resolve();
      });
      this.promise.always(function() {
        done();
      });
      this.eventsWithPromises.publish('myEvent', null, this.promise);
    });

    it("resolves the promise sent with the event when all listeners have resolved theirs", function () {
      assert.equal(this.promise.state(), 'resolved', 'promise resolved');
    });

  });

  describe("rejection of promises", function () {

    beforeEach(function (done) {
      this.promise = this.$.Deferred();
      this.eventsWithPromises.subscribe('myEvent2', function (data, promise) {
        promise.reject();
      });
      this.eventsWithPromises.subscribe('myEvent2', function (data, promise) {
        promise.resolve();
      });
      this.promise.always(function() {
        done();
      });
      this.eventsWithPromises.publish('myEvent2', null, this.promise);
    });

    it("rejects the promise sent with the event when at least one listener has rejected theirs", function () {
      assert.equal(this.promise.state(), 'rejected', 'promise resolved');
    });

  });

});