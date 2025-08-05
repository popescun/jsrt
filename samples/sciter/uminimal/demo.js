'use strict';
const MODULES_PARENT_DIR = __dirname + '/../../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
const sciter = include('sciter/sciter');

sciter.uminimal_init();

const main_iteration = () => {

  sciter.uminimal_main_iteration();
};

const run = () => {
  main_iteration();
  setTimeout(run, 1);
};

run();
