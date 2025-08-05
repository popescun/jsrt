'use strict';
// use vars for internal includes instead consts, as this module may be included multiple times
var imgui_types = include('dear_imgui/dear_imgui_types');
var imgui_widgets = include('dear_imgui/dear_imgui_widgets');
var exports = {

  addonPath : 'addons/dear_imgui/lib/Release/libdear_imgui_addon.so',

  binding : {},

  ImGuiConfigFlags : {
    ImGuiConfigFlags_None : 0,
    ImGuiConfigFlags_NavEnableKeyboard : 1 << 0,
    ImGuiConfigFlags_NavEnableGamepad : 1 << 1,
    ImGuiConfigFlags_NavEnableSetMousePos : 1 << 2,
    ImGuiConfigFlags_NavNoCaptureKeyboard : 1 << 3,
    ImGuiConfigFlags_NoMouse : 1 << 4,
    ImGuiConfigFlags_NoMouseCursorChange : 1 << 5,
    ImGuiConfigFlags_IsSRGB : 1 << 20,
    ImGuiConfigFlags_IsTouchScreen : 1 << 21
  },

  ImGuiBackendFlags : {
    ImGuiBackendFlags_None : 0,
    ImGuiBackendFlags_HasGamepad : 1 << 0,   // Back-end supports gamepad and currently has one connected.
    ImGuiBackendFlags_HasMouseCursors : 1 << 1,   // Back-end supports honoring GetMouseCursor() value to change the OS cursor shape.
    ImGuiBackendFlags_HasSetMousePos : 1 << 2    // Back-end supports io.WantSetMousePos requests to reposition the OS mouse position (only used if ImGuiConfigFlags_NavEnableSetMousePos is set).
  },

  ImGuiKey : {
    ImGuiKey_Tab : 0,
    ImGuiKey_LeftArrow : 1,
    ImGuiKey_RightArrow : 2,
    ImGuiKey_UpArrow : 3,
    ImGuiKey_DownArrow : 4,
    ImGuiKey_PageUp : 5,
    ImGuiKey_PageDown : 6,
    ImGuiKey_Home : 7,
    ImGuiKey_End : 8,
    ImGuiKey_Insert : 9,
    ImGuiKey_Delete : 10,
    ImGuiKey_Backspace : 11,
    ImGuiKey_Space : 12,
    ImGuiKey_Enter : 13,
    ImGuiKey_Escape : 14,
    ImGuiKey_A : 15,
    ImGuiKey_C : 16,
    ImGuiKey_V : 17,
    ImGuiKey_X : 18,
    ImGuiKey_Y : 19,
    ImGuiKey_Z : 20,
    ImGuiKey_COUNT : 21
  },

  GlfwInit : function() {
    this.binding.GlfwInit();
  },

  GlfwMakeContextCurrent : function() {
    this.binding.GlfwMakeContextCurrent();
  },

  GlfwSwapBuffers : function() {
    this.binding.GlfwSwapBuffers();
  },

  GlfwWindowShouldClose : function() {
    return this.binding.GlfwWindowShouldClose();
  },

  GlfwPollEvents : function() {
    this.binding.GlfwPollEvents();
  },  
  
  CreateContext : function() {
    this.binding.CreateContext();
  },

  GetIOHandle : function() {
    return this.binding.GetIOHandle();
  },

  GetStyleHandle : function() {
    return this.binding.GetStyleHandle();
  },

  ImGuiIO_ConfigFlags_Handle : function() {
    return this.binding.ImGuiIO_ConfigFlags_Handle();
  },

  ImGuiIO_BackendFlags_Handle : function() {
    return this.binding.ImGuiIO_BackendFlags_Handle();
  },

  Get_ImGuiIO_ConfigFlags : function() {
    return this.binding.ImGuiIO_ConfigFlags;
  },

  Set_ImGuiIO_ConfigFlags : function(flags) {
    this.binding.ImGuiIO_ConfigFlags = flags;
  },

  Get_ImGuiIO_BackendFlags : function() {
    return this.binding.ImGuiIO_BackendFlags;
  },

  Set_ImGuiIO_BackendFlags : function(flags) {
    this.binding.ImGuiIO_BackendFlags = flags;
  },

  MouseDrawCursor : function() {
    return this.binding.MouseDrawCursor();
  },

  MouseDrawCursorHandle : function() {
    return this.binding.MouseDrawCursorHandle();
  },

  ConfigMacOSXBehaviors : function() {
    return this.binding.ConfigMacOSXBehaviors();
  },

  ConfigMacOSXBehaviorsHandle : function() {
    return this.binding.ConfigMacOSXBehaviorsHandle();
  },

  ConfigInputTextCursorBlink : function() {
    return this.binding.ConfigInputTextCursorBlink();
  },

  ConfigInputTextCursorBlinkHandle : function() {
    return this.binding.ConfigInputTextCursorBlinkHandle();
  },

  ConfigWindowsResizeFromEdges : function() {
    return this.binding.ConfigWindowsResizeFromEdges();
  },

  ConfigWindowsResizeFromEdgesHandle : function() {
    return this.binding.ConfigWindowsResizeFromEdgesHandle();
  },

  ConfigWindowsMoveFromTitleBarOnly : function() {
    return this.binding.ConfigWindowsMoveFromTitleBarOnly();
  },

  ConfigWindowsMoveFromTitleBarOnlyHandle : function() {
    return this.binding.ConfigWindowsMoveFromTitleBarOnlyHandle();
  },

  ImGui_ImplGlfw_InitForOpenGL : function(window) {
    this.binding.ImGui_ImplGlfw_InitForOpenGL(window);
  },

  ImGui_ImplOpenGL2_Init : function() {
    this.binding.ImGui_ImplOpenGL2_Init();
  },

  ImGui_ImplOpenGL2_NewFrame : function() {
    this.binding.ImGui_ImplOpenGL2_NewFrame();
  },

  ImGui_ImplGlfw_NewFrame : function() {
    this.binding.ImGui_ImplGlfw_NewFrame();
  },

  NewFrame : function() {
    this.binding.NewFrame();
  },

  Begin : function(name) {
    this.binding.Begin(name);
  },

  End : function() {
    this.binding.End();
  },

  Render : function() {
    this.binding.Render();
  },

  ImGui_ImplOpenGL2_RenderDrawData : function() {
    this.binding.ImGui_ImplOpenGL2_RenderDrawData();
  },

  Version : function() {
    return this.binding.Version();
  },

  Indent : function(indent_w) {
    this.binding.Indent(indent_w);
  },

  Unindent : function(indent_w) {
    this.binding.Unindent(indent_w);
  },

  GetTime : function() {
    return this.binding.GetTime();
  },

  IsKeyPressed : function(user_key_index) {
    return this.binding.IsKeyPressed(user_key_index);
  },

  GetKeyIndex : function(imgui_key) {
    return this.binding.GetKeyIndex(imgui_key);
  },

  IsItemHovered : function() {
    return this.binding.IsItemHovered();
  },

  BeginTooltip : function() {
    return this.binding.BeginTooltip();
  },

  EndTooltip : function() {
    return this.binding.EndTooltip();
  },

  PushTextWrapPos : function(wrap_pos_x) {
    this.binding.PushTextWrapPos(wrap_pos_x);
  },

  PopTextWrapPos : function() {
    this.binding.PopTextWrapPos();
  },

  GetFontSize : function() {
    return this.binding.GetFontSize();
  },

  PushItemWidth : function(item_width) {
    this.binding.PushItemWidth(item_width);
  },

  GetWindowWidth : function() {
    return this.binding.GetWindowWidth();
  },

  StyleColorsClassic : function() {
    this.binding.StyleColorsClassic();
  },

  StyleColorsDark : function() {
    this.binding.StyleColorsDark();
  },

  StyleColorsLight : function() {
    this.binding.StyleColorsLight();
  },

  GetFontHandle : function() {
    return this.binding.GetFontHandle();
  },

  GetFontDebugName : function(font_handle) {
    return this.binding.GetFontDebugName(font_handle);
  },

  ShowNativeDemoWindow : function(show) {
    this.binding.ShowNativeDemoWindow(show);
  }
};

var onincluded = function(binding) {
  console.log('dear_imgui onincluded...');
  var merged_exports = {};
  Object.assign(merged_exports, exports, imgui_types, imgui_widgets);
  merged_exports.binding = binding;
  return merged_exports;
};
