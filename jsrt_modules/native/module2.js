'use strict';
var exports = {

  binding : {},

  sayBye : function() {
    return this.binding.sayBye();
  }
};

var onincluded = function(binding) {
  console.log('module2 onincluded...');
  exports.binding = binding;
  return exports;
};

