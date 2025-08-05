'use strict';
var sciter = include('sciter/sciter');

sciter.init();
sciter.createView();
sciter.loadFile(__dirname + '/node-methods.htm');

sciter.getGreeting = function(param) {
  return "Node: Hi " + param + "!";
}

sciter.expand();

const main_iteration = () => {
  sciter.main_iteration();
};

const run = () => {
  if (sciter.existView()) {
    main_iteration();
    setTimeout(run, 1);
  }
};

run();


