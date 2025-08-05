'use strict';
var exports = {

  binding : {},

  getNativeActivity : function() {
    return this.binding.getNativeActivity();
  },

  getSavedState : function() {
    return this.binding.getSavedState();
  },

  getSavedStateSize : function() {
    return this.binding.getSavedStateSize();
  }
};

var onincluded = function(binding) {
  console.log('android_activity onincluded...');
  exports.binding = binding;
  return exports;
};