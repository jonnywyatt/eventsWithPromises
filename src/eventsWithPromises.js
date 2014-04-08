define(['jquery'], function ($) {
  var subscriptions = {};

  return {

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

    unsubscribeAll: function() {
      subscriptions = {};
    },

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