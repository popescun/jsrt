//take care all variables are declared
'use strict';
var exports = {

  binding : {},

  sayHello : function() {
    return this.binding.sayHello();
  }
};

var onincluded = function(binding) {
  console.log('module1 onincluded...');
  exports.binding = binding;
  return exports;
};

