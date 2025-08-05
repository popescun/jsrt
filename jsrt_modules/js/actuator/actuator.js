'use strict';
var exports = {

  Actuator : function(...args) {

    let me = this;

    this.actions = new Array();

    this.results = new Array();

    // we can add args actions
    for (var i = 0; i < args.length ; ++i) {
      this.add(args[i]);
    }

    this.add = function(action) {
      me.actions.push(action);
    }

    this.remove = function(action) {
      me.actions.splice( me.actions.indexOf(action), 1 );
    }

    this.call = function(...args) {
      this.results = [];
      for (var i = 0; i < me.actions.length ; ++i) {
        this.results.push(me.actions[i](args));
      }
    }
  },

  connect_duplex : function(actuatorName, actionName, component1, component2) {
    component1[actuatorName].add(component2[actionName]);
    component2[actuatorName].add(component1[actionName]);
  }
};

var onincluded = function() {
  console.log('actuator onincluded...');
  return exports;
};
