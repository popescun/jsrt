'use strict';
var exports = {

  addonPath : 'addons/sciter/build/output/lib/linux_x86_64/Release/libsciter_gtk_addon.so',

  binding : {},

  init : function() {
    this.binding.init();
  },

  setDebugMode : function() {
    this.binding.setDebugMode();
  },

  main_iteration : function() {
    this.binding.main_iteration();
  },

  loop : function() {
    this.binding.loop();
  },

  createView : function() {
    this.binding.createView();
  },

  existView : function() {
    return this.binding.existView();
  },

  loadFile : function(file) {
    this.binding.loadFile(file);
  },

  expand : function() {
    this.binding.expand();
  },

  collapse : function() {
    this.binding.collapse();
  },

  dismiss : function() {
    this.binding.dismiss();
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
  }
};

var onincluded = function(binding) {
  console.log('sciter_gtk onincluded...');
  exports.binding = binding;
  return exports;
};