'use strict';
// we need to assign node require() to node global object
// so that it may be accessed from jsrt modules
// alternatively we can assign to jsrtcore object
//jsrtcore.require = require;
global.require = require;

const MODULES_PARENT_DIR = __dirname;
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);

const mod = include('dummy');
console.log(mod.sayHello());
