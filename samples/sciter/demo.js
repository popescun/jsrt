'use strict';
const MODULES_PARENT_DIR = __dirname + '/../../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
const sciter = include('sciter/sciter_gtk');

sciter.init();
sciter.setDebugMode();
sciter.createView();
sciter.loadFile(__dirname + '/test.htm');
sciter.expand();

/*const main_iteration = () => {
  sciter.main_iteration();
};

const run = () => {
  main_iteration();
  if (sciter.existView()) {
    setTimeout(run, 1);
  }
};

run();*/

sciter.loop();
