'use strict';
var exports = {

  Text : function(text) {
    this.binding.Text(text);
  },

  TextColored : function(vec4, text) {
    this.binding.TextColored(vec4, text);
  },

  BulletText : function(text) {
    this.binding.BulletText(text);
  },

  Button : function(label) {
    return this.binding.Button(label);
  },

  SameLine : function() {
    this.binding.SameLine();
  },

  BeginMenuBar : function() {
    return this.binding.BeginMenuBar();
  },

  EndMenuBar : function() {
    this.binding.EndMenuBar();
  },

  BeginMenu : function(label) {
    return this.binding.BeginMenu(label);
  },

  EndMenu : function() {
    this.binding.EndMenu();
  },

  MenuItem : function(label) {
    this.binding.MenuItem(label);
  },

  Spacing : function() {
    this.binding.Spacing();
  },

  CollapsingHeader : function(label) {
    return this.binding.CollapsingHeader(label);
  },

  TreeNode : function(label) {
    return this.binding.TreeNode(label);
  },

  TreePop : function() {
    this.binding.TreePop();
  },

  CheckboxFlags : function(label, flags_handle, flag_value) {
    return this.binding.CheckboxFlags(label, flags_handle, flag_value);
  },

  Checkbox : function(label, v_handle) {
    return this.binding.Checkbox(label, v_handle);
  },

  Separator : function(label) {
    this.binding.Separator(label);
  },

  TextDisabled : function(text) {
    this.binding.TextDisabled(text);
  },

  TextUnformatted : function(text) {
    this.binding.TextUnformatted(text);
  },

  Combo : function(label, current_item_handle, items) {
    return this.binding.Combo(label, current_item_handle, items);
  },

  BeginCombo : function(label, preview_value) {
    return this.binding.BeginCombo(label, preview_value);
  },

  EndCombo : function() {
    return this.binding.EndCombo();
  }
};

var onincluded = function() {
  console.log('dear_imgui_widgets onincluded...');
  return exports;
};

