'use strict';
var exports = {

  binding : {},

  log : function(text) {
    if (process.platform === 'android') {
      this.binding.log(text);
    }
  }
};

var onincluded = function(binding) {
  console.log('android_logger onincluded...');
  exports.binding = binding;
  return exports;
};