describe("subscription", function () {

  before(function (done) {
    var self = this;
    requirejs(['src/eventsWithPromises', 'jquery'], function (eventsWithPromises, $) {
      self.eventsWithPromises = eventsWithPromises;
      self.$ = $;
      done();
    }, done);

  });

  it("adds a subscription if event name and callback supplied", function () {
    var spy = sinon.spy(),
        data = {
          key: 'value'
        };
    this.eventsWithPromises.subscribe('myEventType', spy);
    this.eventsWithPromises.publish('myEventType', data);
    assert(spy.calledWith(data));
  });

  it("calls a callback on a context if supplied", function() {

  });

  it("sends a promise to each listener if event is published with a promise", function () {
    var spy1 = sinon.spy(),
        spy2 = sinon.spy();
    this.eventsWithPromises.subscribe('myEvent', function(data) {
      assert(data.promise !== null, 'Promise supplied to listener')
    });
    this.eventsWithPromises.subscribe('myEvent', spy2);

    this.eventsWithPromises.publish('myEventType', null, this.$.Deferred());
  });

});