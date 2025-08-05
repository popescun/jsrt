'use strict';

var exports = {

  Controller : function() {

    let ControllerImpl = function() {

      let me = this;

      const actuatorModule = include('actuator/actuator');

      this.sendEvent = new actuatorModule.Actuator();

      this.receiveEvent = function(event) {
        console.log('AppController::ControllerImpl receiveEvent from:', event[0].from, 'to:', event[0].to, ' event:', event[0].type);

        me.sendEvent.call(event[0]);
      }
    }

    return new ControllerImpl();
  }
};

var onincluded = function() {
  console.log('AppController onincluded...');
  return exports;
};

