'use strict';
var exports = {

  PresenterBase : function (sciterObj, place, fluxDispatcher) {

    let me = this;

    let PresenterBaseImpl = function(sciterObj, place, fluxDispatcher) {

      this.PLACE = place;
      this.fluxDispatcher = fluxDispatcher;
      this.sciterObj = sciterObj;

      const actuatorModule = include('actuator/actuator');

      this.sendEvent = new actuatorModule.Actuator();

      // override in objects of this prototype
      this.receiveEvent = function(event) {
        console.log('AppController::PresenterBaseImpl receiveEvent...');
      }

      // todo: it seems this can be removed as it's replaced by receiveEvent
      // override in objects of this prototype
      // this.event = function(event) {
      //   console.log('PresenterBase place ' + this.PLACE +':override \'event\' method!');
      // }
    }

    return new PresenterBaseImpl(sciterObj, place, fluxDispatcher);
  }
};

var onincluded = function() {
  console.log('PresenterBase onincluded...');
  return exports;
};

