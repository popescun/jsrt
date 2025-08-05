'use strict';
var exports = {

  binding : {},

  log : function(text) {
    this.binding.log(text);
  }
};

var onincluded = function(binding) {
  exports.binding = binding;
  return exports;
};