describe("subscription", function () {

  before(function (done) {
    var self = this;
    requirejs(['src/eventsWithPromises', 'rsvp'], function (eventsWithPromises, RSVP) {
      self.eventsWithPromises = eventsWithPromises;
      self.RSVP = RSVP;
      done();
    }, done);

  });

  afterEach(function () {
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
    this.eventsWithPromises.publish('myEvent', null);
  });

  describe("resolution of promises", function () {

    beforeEach(function (done) {
      var self = this;

      this.resolved = sinon.spy();
      this.eventsWithPromises.subscribe('myEvent', function (data, promise) {
        promise.resolve();
      });
      this.eventsWithPromises.subscribe('myEvent', function (data, promise) {
        promise.resolve();
      });
      this.eventsWithPromises.publish('myEvent', null)
          .then(function(results){
            self.resolved(results[1].state);
            done();
          });
    });

    it("resolves the promise returned by publish when all listeners have resolved theirs", function () {
      sinon.assert.calledWith(this.resolved, 'fulfilled');
    });

  });

  describe("rejection of promises", function () {

    beforeEach(function (done) {
      var self = this;

      this.rejected = sinon.spy();
      this.eventsWithPromises.subscribe('myEvent2', function (data, deferred) {
        deferred.reject();
      });
      this.eventsWithPromises.subscribe('myEvent2', function (data, deferred) {
        deferred.resolve();
      });
      this.eventsWithPromises.publish('myEvent2', null)
          .then(function(results){
            self.rejected(results[0].state);
            done();
          });
    });

    it("rejects the promise returned by publish when at least one listener has rejected theirs", function () {
      sinon.assert.calledWith(this.rejected, 'rejected');
    });

  });

  describe("rejecting with an error", function () {
    var message = "test error";

    beforeEach(function (done) {
      var self = this;

      this.eventsWithPromises.subscribe('myEvent3', function (data, deferred) {
        deferred.resolve();
      });
      this.eventsWithPromises.subscribe('myEvent3', function (data, deferred) {
        deferred.reject(Error(message));
      });
      this.eventsWithPromises.subscribe('myEvent3', function (data, deferred) {
        deferred.resolve();
      });
      this.eventsWithPromises.publish('myEvent3', null)
          .then(function(results) {
            self.error = results[1];
            done();
          });
    });

    it("passes an error object back up the chain", function () {
      assert.equal(this.error.reason.constructor, Error, 'Error object passed');
      assert.equal(this.error.reason.message, message, 'Error object passed');
    });

  });
});
