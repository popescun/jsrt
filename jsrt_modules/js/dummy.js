'use strict';
var fs = require('fs');
var exports = {
  sayHello : function() {
    return "Dummy says hello!";
  }
};

var onincluded = function() {
  console.log('dummy onincluded...');
  return exports;
};

