eventsWithPromises
==================

Event hub using promises so event listeners can throw errors / return values to the event emitter

# USAGE

An AMD module that returns an object literal with the following methods:
* subscribe - Add a subscription to the specified event name. If a context is supplied, the subscription can later be removed using unsubscribe
* unsubscribe - remove a subscription from the supplied event. The original subscription must have supplied a context, so the it can be found in the stored list of subscriptions.
* unsubscribeAll - remove all subscriptions for all event names
* publish - Publish an event. If a promise is supplied, then every listener will be supplied with its own individual promise, which it can resolve or reject. If all are resolved successfully, the main promise will be resolved. If even one of them is rejected or fails, the main promise will fail.

# SETUP

```
bower install
```

# TESTS

```
npm install
```

then

```
karma start test/karma.conf.js --single-run
```
