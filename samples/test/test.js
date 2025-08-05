'use strict';
global.require = require;

var assert = require('assert');

const MODULES_PARENT_DIR = __dirname + "/../../";
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);

const mod1 = include('module1');
const mod2 = include('module2');
const mod3 = include('dummy');

console.log(mod1.sayHello());
console.log(mod2.sayBye());
console.log(mod3.sayHello());

assert(jsrtcore.Int('x', 10) === jsrtcore.GetInt('x'));
assert(jsrtcore.IntHandle('x') !== 0);
console.log('x handle=' + jsrtcore.IntHandle('x'));
