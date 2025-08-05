'use strict';
var exports = {

  addonPath : 'addons/sciter/build/output/lib/linux_x86_64/Release/libsciter_glfw_addon.so',

  binding : {},

  init : function() {
    this.binding.init();
  },

  setDebugMode : function() {
    this.binding.setDebugMode();
  },

  windowShouldClose : function() {
    return this.binding.windowShouldClose();
  },

  drawFrame : function() {
    this.binding.drawFrame();
  },

  loadFile : function(file) {
    this.binding.loadFile(file);
  },

  /**
   *
   * @param  {...any} args
   *  args[0] is ti script function
   *  args[1..n] are ti function arguments
   */
  call : function(...args) {
    // we need to explicitly pass variadic arguments to native call
    const KMaxArguments = 11;
    if (args.length > 11) {
      console.log('WARNING: sciter.call() invalid number of arguments:' +
        args.length + ', max arguments:, ' + KMaxArguments);
    }
    return this.binding.call(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
  },

  drawLoop : function() {
    this.binding.drawLoop();
  }
};

var onincluded = function(binding) {
  console.log('sciter_glfw onincluded...');
  exports.binding = binding;
  return exports;
};