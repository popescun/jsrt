'use strict';
var exports = {

  StoreBase : function(name) {

    let StoreBaseImpl = function(name) {

      const actuatorModule = include('actuator/actuator');

      let me = this;

      this.callbackMap = new Map();

      this.NAME = name;

      this.subscribe = function(callbackName, callback) {
        if (this.callbackMap.get(callbackName) === undefined) {
          let actuator = new actuatorModule.Actuator();
          actuator.add(callback);
          this.callbackMap.set(callbackName, actuator);
        } else {
          this.callbackMap.get(callbackName).add(callback);
        }
      }

      // override in objects of this prototype
      this.action = function(action) {
        console.log('StoreBase action: override this method');
      }
    }

    return new StoreBaseImpl(name);
  }
};

var onincluded = function() {
  console.log('StoreBase onincluded...');
  return exports;
};

