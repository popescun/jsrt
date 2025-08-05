'use strict';
const sciter = include('sciter/sciter');

sciter.init();
sciter.createView();
sciter.loadFile(__dirname + '/../../deps/sciter/notes/res/boot.htm');
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
