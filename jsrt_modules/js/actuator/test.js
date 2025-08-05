'use strict;'

const actuatorModule = include('actuator/actuator');

var actuator = new actuatorModule.Actuator();

var action1 = function(args) {
  console.log('action1:', args[0]);
};

var action2 = function(args) {
  console.log('action2:', args[1]);
};

actuator.add(action1);
actuator.add(action2);
console.log(actuator.actions);
actuator.call(1, 2);

actuator.remove(action1);
console.log(actuator.actions);
actuator.call(1, 2);

actuator.remove(action2);
console.log(actuator.actions);
actuator.call(1, 2);

actuator = new actuatorModule.Actuator(action1, action2);
console.log(actuator.actions);
actuator.call(1, 2);