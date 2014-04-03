describe("subscription", function() {

  before(function(done) {
    var self = this;
    requirejs(['src/eventsWithPromises'], function(eventsWithPromises) {
      self.eventsWithPromises = eventsWithPromises;
      done();
    }, done);

  });

  it("adds a subscription if event name and callback supplied", function() {
    var spy = sinon.spy();
    this.eventsWithPromises.subscribe('myEventType', spy);
    this.eventsWithPromises.publish('myEventType', 'test');
    assert(spy.called);
  });

});