'use strict';
var exports = {

  Dispatcher : function(stores) {

    let me = this;

    let DispatcherImpl = function(stores) {

      const actuatorModule = include('actuator/actuator');

      let me = this;

      this.actuator = new actuatorModule.Actuator();

      if (stores !== undefined) {
        for(var store of stores) {
          this.actuator.add(store.action);
        }
      }

      this.dispatchAction = function(action) {
        // console.log('Dispatcher::DispatcherImpl dispatchAction...');

        console.log('Dispatcher::DispatcherImpl from:', action.from, 'to:', action.to);

        me.actuator.call(action);
      }
    }

    this.impl = new DispatcherImpl(stores);

    this.addStore = function(store) {
      this.impl.actuator.add(store.action);
    }

    this.dispatchAction = function(action) {
      me.impl.dispatchAction(action);
    }

    this.executeAction = function(action) {
      for(var store of stores) {
        if (store.NAME === action.to) {
          let actuator = store.callbackMap.get(action.type);
          if (actuator !== undefined) {
            actuator.call(action);
            return actuator.results;
          } else {
            console.log('dispatcher executeAction...FAIL: undefined actuator')
          }
        }
      }
    }
  }
};

var onincluded = function() {
  console.log('Dispatcher onincluded...');
  return exports;
};

