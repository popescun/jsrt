'use strict';
var exports = {
  ImVec4 : function(x, y, z, w) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
    this.w = w === undefined ? 0 : w;
  }
};

var onincluded = function() {
  console.log('dear_imgui_types onincluded...');
  return exports;
};

