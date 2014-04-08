define(['jquery'], function ($) {
  var subscriptions = {};

  return {

    /**
     * Add a subscription to the specified event name. If a context is supplied, the subscription
     * can later be removed using unsubscribe
     * @param {string} eventName
     * @param {function} callback
     * @param {object} [context]
     */
    subscribe: function (eventName, callback, context) {
      var found = false;

      if (!eventName || (typeof eventName !== 'string')) {
        throw "Event name not supplied to subscribe method";
      }
      if (!callback || (typeof callback !== 'function')) {
        throw "Callback not supplied to subscribe method";
      }

      if (!subscriptions[eventName]) {
        subscriptions[eventName] = [];
      } else {
        for (var i = 0, j = subscriptions[eventName].length; i < j; i++) {
          if (subscriptions[eventName][i].callback === callback) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        subscriptions[eventName].push({
          callback: callback,
          context: context
        });
      }
    },

    /**
     * Unsubscribe from the supplied event. The original subscription must have supplied a context, so the
     * it can be found in the stored list of subscriptions.
     * @param {string} eventName
     * @param {object} context
     */
    unsubscribe: function(eventName, context) {
      if (!eventName || (typeof eventName !== 'string')) {
        throw "Event name not supplied to unsubscribe method";
      }
      if (!context || (typeof context !== 'object')) {
        throw "Context not supplied to unsubscribe method";
      }
      if (subscriptions[eventName]) {
        for (var i = 0, j = subscriptions[eventName].length; i < j; i++) {
          if (subscriptions[eventName][i].context === context) {
            subscriptions[eventName].splice(i, 1);
            break;
          }
        }
      }
    },

    /**
     * Unsubscribe all events
     */
    unsubscribeAll: function() {
      subscriptions = {};
    },

    /**
     * Publish an event. If a promise is supplied, then every listener will be supplied with its own individual
     * promise, which it can resolve or reject. If all are resolved successfully, the main promise will be resolved.
     * If even one of them is rejected or fails, the main promise will fail.
     * @param {string} eventName
     * @param {*} data
     * @param {object} [promise]
     */
    publish: function (eventName, data, promise) {
      var subscriptionsForEvent,
          promises = [];

      if (subscriptions[eventName]) {
        subscriptionsForEvent = subscriptions[eventName];
        if (promise) {
          for (var i = 0, j = subscriptionsForEvent.length; i < j; i++) {
            promises.push($.Deferred());
          }
          $.when.apply($, promises)
              .done(function () {
                promise.resolve();
              })
              .fail(function () {
                promise.reject();
              });
        }
        for (var i = 0, j = subscriptionsForEvent.length; i < j; i++) {
          if (subscriptionsForEvent[i].context) {
            subscriptionsForEvent[i].callback.call(subscriptionsForEvent[i].context, data, promises[i] || null)
          } else {
            subscriptionsForEvent[i].callback(data, promises[i] || null);
          }
        }

      }
    }

  }
});