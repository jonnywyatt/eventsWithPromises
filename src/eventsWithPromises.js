define(['jquery'], function($) {
  var subscriptions = {};

  return {
    subscribe: function(eventName, callback, context) {
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

    publish: function(eventName, data) {
      var subscriptionsForEvent;
      if (subscriptions[eventName]) {
        debugger;
       subscriptionsForEvent = subscriptions[eventName];
        for (var i = 0, j = subscriptionsForEvent.length; i < j; i++) {
          if (subscriptionsForEvent[i].context) {
            subscriptionsForEvent[i].context.call(context, data)
          } else {
            subscriptionsForEvent[i].callback(data);
          }
        }
      }
    }
  }
});