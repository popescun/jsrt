'use strict';
var exports = {
  selectFile : function(sciterNativeObj, mode, filter, extension) {
    //console.log('View.selectFile...');
    return sciterNativeObj.call('View.selectFile', mode, filter, extension);
  },

  selectFolder : function(sciterNativeObj) {
    //console.log('View.selectFile...');
    return sciterNativeObj.call('View.selectFolder');
  },

  msgbox : function(sciterNativeObj, type, text, title, buttons) {
    return sciterNativeObj.call('View.msgbox', type, text, title, buttons);
  },

  root : function(sciterView) {
    //console.log('Common.viewRoot...');
    return sciterView.call('View.root');
  },

  window : function(sciterView, params) {
    console.log('View.window...');
    sciterView.call('View.window', params);
  }
};

var onincluded = function() {
  console.log('View onincluded...');
  return exports;
};

