# eventsWithPromises

The event hub / aggregator pattern is fantastic for decoupling code modules but the emitted events are usually ‘fire and forget’ so if the event listeners want to feed back an error or status report to the event emitter, they can’t.

Adding jQuery promises solves this – if the event is published along with a promise, then each event listener will receive its own promise. Once the listener has performed any synchronous / async tasks that it needs to, it can choose to resolve or reject the promise it has received. If all event listeners report success using their promises, then the original promise sent by the emitter will resolve successfully. However if one or more of the listeners reject (fail) their promises, the promise sent by the emitter will fail.

Because the event listeners are receiving promises, they can wait until async activities eg. ajax are complete before resolving their promise. Handy if decoupled modules need to save state or complete animations before feeding back to the event emitter.

## Usage

An AMD module that returns an object literal with the following methods:
* **subscribe** - Add a subscription to the specified event name. If a context is supplied, the subscription can later be removed using unsubscribe
* **unsubscribe** - remove a subscription from the supplied event. The original subscription must have supplied a context, so the it can be found in the stored list of subscriptions.
* **unsubscribeAll** - remove all subscriptions for all event names
* **publish** - Publish an event. If a promise is supplied, then every listener will be supplied with its own individual promise, which it can resolve or reject. If all are resolved successfully, the main promise will be resolved. If even one of them is rejected or fails, the main promise will fail.

## Setup

```
bower install
```

## Tests

```
npm install
```

then

```sh
npm test
# ./node_modules/karma/bin/karma start test/karma.conf.js --single-run
```
