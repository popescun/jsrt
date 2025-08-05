'use strict';
const imgui = include('dear_imgui/dear_imgui');

var dear_imgui_demo_impl = {
  counter : 0,

  textColor : new imgui.ImVec4(0.0, 0.8, 0.8, 1.0),

  // Helper to display basic user controls.
  ShowUserGuide : function() {
    imgui.BulletText("Double-click on title bar to collapse window.");
    imgui.BulletText("Click and drag on lower right corner to resize window\n(double-click to auto fit window to its contents).");
    imgui.BulletText("Click and drag on any empty space to move window.");
    imgui.BulletText("TAB/SHIFT+TAB to cycle through keyboard editable fields.");
    imgui.BulletText("CTRL+Click on a slider or drag box to input value as text.");
    //if (ImGui::GetIO().FontAllowUserScaling)
    //ImGui::BulletText("CTRL+Mouse Wheel to zoom window contents.");
    imgui.BulletText("Mouse Wheel to scroll.");
    imgui.BulletText("While editing text:\n");
    imgui.Indent(0.0);
    imgui.BulletText("Hold SHIFT or use mouse to select text.");
    imgui.BulletText("CTRL+Left/Right to word jump.");
    imgui.BulletText("CTRL+A or double-click to select all.");
    imgui.BulletText("CTRL+X,CTRL+C,CTRL+V to use clipboard.");
    imgui.BulletText("CTRL+Z,CTRL+Y to undo/redo.");
    imgui.BulletText("ESCAPE to revert.");
    imgui.BulletText("You can apply arithmetic operators +,*,/ on numerical values.\nUse +- to subtract.");
    imgui.Unindent(0.0);
  },

  ShowStyleSelector : function ShowStyleSelector(label) {
    if (typeof ShowStyleSelector.style_idx_handle === 'undefined') {
      jsrtcore.Int('style_idx', -1);
      ShowStyleSelector.style_idx_handle = jsrtcore.IntHandle('style_idx');
    }
    if (imgui.Combo(label, ShowStyleSelector.style_idx_handle, 'Classic|Dark|Light|')) {
      switch (jsrtcore.GetInt('style_idx')) {
        case 0: imgui.StyleColorsClassic(); break;
        case 1: imgui.StyleColorsDark(); break;
        case 2: imgui.StyleColorsLight(); break;
      }
      return true;
    }
    return false;
  },

  // we need to give a name to the function to simulate static variables
  ShowStyleEditor : function ShowStyleEditor(style_handle) {
    // You can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it compares to an internally stored reference)
    let styleHandle = imgui.GetStyleHandle();

    // Default to using internal storage as reference
    if (typeof ShowStyleEditor.init === 'undefined') { // this is how define static var in JS
      ShowStyleEditor.init = true;
    }
    if (ShowStyleEditor.init && style_handle === undefined) {
      if (typeof ShowStyleEditor.savedStyleHandle === 'undefined') {
        ShowStyleEditor.savedStyleHandle = styleHandle;
      }
    }
    ShowStyleEditor.init = false;
    if (style_handle === undefined) {
      style_handle = ShowStyleEditor.savedStyleHandle;
    }

    imgui.PushItemWidth(imgui.GetWindowWidth() * 0.50);

    if (this.ShowStyleSelector("Colors##Selector")) {
      ShowStyleEditor.savedStyleHandle = styleHandle;
    }
    this.ShowFontSelector("Fonts##Selector");
  },

  // Demo helper function to select among loaded fonts.
  // Here we use the regular BeginCombo()/EndCombo() api which is more the more flexible one.
  ShowFontSelector : function(label) {
      let io = imgui.GetIOHandle();
      let font_current = imgui.GetFontHandle();
      if (imgui.BeginCombo(label, imgui.GetFontDebugName(font_current))) {
          /*for (int n = 0; n < io.Fonts->Fonts.Size; n++)
          {
              ImFont* font = io.Fonts->Fonts[n];
              ImGui::PushID((void*)font);
              if (ImGui::Selectable(font->GetDebugName(), font == font_current))
                  io.FontDefault = font;
              ImGui::PopID();
          }*/
          imgui.EndCombo();
      }
      imgui.SameLine();
      this.HelpMarker(
          '- Load additional fonts with io.Fonts->AddFontFromFileTTF().\n \
           - The font atlas is built when calling io.Fonts->GetTexDataAsXXXX() or io.Fonts->Build().\n \
           - Read FAQ and documentation in misc/fonts/ for more details.\n \
           - If you need to add/remove fonts at runtime (e.g. for DPI change), do it before calling NewFrame().');
  },

  ShowDemoWindow : function() {
    imgui.Begin('ImGui Demo JS');

    imgui.Text('dear imgui says hello. (' + imgui.Version() + ')');

    if (imgui.BeginMenuBar()) {
      if (imgui.BeginMenu('Menu')) {
        imgui.MenuItem('Item1');
        imgui.EndMenu();
      }

      if (imgui.BeginMenu('Examples')) {
        imgui.MenuItem('Item1');
        imgui.EndMenu();
      }

      if (imgui.BeginMenu('Help')) {
        imgui.MenuItem('Item1');
        imgui.EndMenu();
      }

      imgui.EndMenuBar();
    }

    imgui.Spacing();

    if (imgui.CollapsingHeader('Help')) {
      imgui.Text('PROGRAMMER GUIDE:');
      imgui.BulletText('Please see the ShowDemoWindow() code in imgui_demo.cpp. <- you are here!');
      imgui.BulletText('Please see the comments in imgui.cpp.');
      imgui.BulletText('Please see the examples/ in application.');
      imgui.BulletText('Enable \'io.ConfigFlags |= NavEnableKeyboard\' for keyboard controls.');
      imgui.BulletText('Enable \'io.ConfigFlags |= NavEnableGamepad\' for gamepad controls.');

      imgui.Separator();
      imgui.Text('USER GUIDE:');
      this.ShowUserGuide();
    }

    if (imgui.CollapsingHeader('Configuration')) {
      if (imgui.TreeNode('Configuration##2')) {
        imgui.CheckboxFlags('io.ConfigFlags: NavEnableKeyboard', imgui.ImGuiIO_ConfigFlags_Handle(), imgui.ImGuiConfigFlags.ImGuiConfigFlags_NavEnableKeyboard);
        imgui.CheckboxFlags('io.ConfigFlags: NavEnableGamepad', imgui.ImGuiIO_ConfigFlags_Handle(), imgui.ImGuiConfigFlags.ImGuiConfigFlags_NavEnableGamepad);
        imgui.SameLine(); this.HelpMarker('Required back-end to feed in gamepad inputs in io.NavInputs[] and set io.BackendFlags |= ImGuiBackendFlags_HasGamepad.\n\nRead instructions in imgui.cpp for details.');
        imgui.CheckboxFlags('io.ConfigFlags: NavEnableSetMousePos', imgui.ImGuiIO_ConfigFlags_Handle(), imgui.ImGuiConfigFlags.ImGuiConfigFlags_NavEnableSetMousePos);
        imgui.SameLine(); this.HelpMarker('Instruct navigation to move the mouse cursor. See comment for ImGuiConfigFlags_NavEnableSetMousePos.');
        imgui.CheckboxFlags("io.ConfigFlags: NoMouse", imgui.ImGuiIO_ConfigFlags_Handle(), imgui.ImGuiConfigFlags.ImGuiConfigFlags_NoMouse);
        if (imgui.Get_ImGuiIO_ConfigFlags() & imgui.ImGuiConfigFlags.ImGuiConfigFlags_NoMouse) {
          debugger;
          if (imgui.GetTime() % 0.4 < 0.2) {
            imgui.SameLine();
            imgui.Text('<<PRESS DOWN ARROW TO DISABLE>>');
          }
          if (imgui.IsKeyPressed(imgui.GetKeyIndex(imgui.ImGuiKey.ImGuiKey_DownArrow))) {            
            let flags = imgui.Get_ImGuiIO_ConfigFlags();
            flags =  flags & ~imgui.ImGuiConfigFlags.ImGuiConfigFlags_NoMouse;
            imgui.Set_ImGuiIO_ConfigFlags(flags);
          }
        }
        imgui.CheckboxFlags('io.ConfigFlags: NoMouseCursorChange', imgui.ImGuiIO_ConfigFlags_Handle(), imgui.ImGuiConfigFlags.ImGuiConfigFlags_NoMouseCursorChange);
        imgui.SameLine(); this.HelpMarker('Instruct back-end to not alter mouse cursor shape and visibility.');
        imgui.Checkbox('io.ConfigInputTextCursorBlink', imgui.ConfigInputTextCursorBlinkHandle());
        imgui.SameLine(); this.HelpMarker('Set to false to disable blinking cursor, for users who consider it distracting');
        imgui.Checkbox('io.ConfigWindowsResizeFromEdges', imgui.ConfigWindowsResizeFromEdgesHandle());
        imgui.SameLine(); this.HelpMarker('Enable resizing of windows from their edges and from the lower-left corner.\nThis requires (io.BackendFlags & ImGuiBackendFlags_HasMouseCursors) because it needs mouse cursor feedback.');
        imgui.Checkbox('io.ConfigWindowsMoveFromTitleBarOnly', imgui.ConfigWindowsMoveFromTitleBarOnlyHandle());
        imgui.Checkbox('io.MouseDrawCursor', imgui.MouseDrawCursorHandle());
        imgui.SameLine(); this.HelpMarker('Instruct Dear ImGui to render a mouse cursor for you. Note that a mouse cursor rendered via your application GPU rendering path will feel more laggy than hardware cursor, but will be more in sync with your other visuals.\n\nSome desktop applications may use both kinds of cursors (e.g. enable software cursor only when resizing/dragging something).');
        imgui.TreePop();
        imgui.Separator();
      }

      if (imgui.TreeNode('Backend Flags')) {
        this.HelpMarker('Those flags are set by the back-ends (imgui_impl_xxx files) to specify their capabilities.');
        // Make a local copy to avoid modifying the back-end flags.
        let backend_flags = jsrtcore.Int('backend_flags', imgui.Get_ImGuiIO_BackendFlags());
        //console.log('backend_flags=' + backend_flags);
        let backend_flags_handle = jsrtcore.IntHandle('backend_flags');
        imgui.CheckboxFlags('io.BackendFlags: HasGamepad', backend_flags_handle, imgui.ImGuiBackendFlags.ImGuiBackendFlags_HasGamepad);
        imgui.CheckboxFlags("io.BackendFlags: HasMouseCursors", backend_flags_handle, imgui.ImGuiBackendFlags.ImGuiBackendFlags_HasMouseCursors);
        imgui.CheckboxFlags("io.BackendFlags: HasSetMousePos", backend_flags_handle, imgui.ImGuiBackendFlags.ImGuiBackendFlags_HasSetMousePos);
        imgui.TreePop();
        imgui.Separator();
      }

      if (imgui.TreeNode("Style")) {
        this.ShowStyleEditor();
        imgui.TreePop();
        imgui.Separator();
      }
    }

    if (imgui.CollapsingHeader('Window options')) {
    }

    imgui.End();
  },

  HelpMarker : function(desc) {
    imgui.TextDisabled("(?)");
    if (imgui.IsItemHovered()) {
      imgui.BeginTooltip();
      imgui.PushTextWrapPos(imgui.GetFontSize() * 35.0);
      imgui.TextUnformatted(desc);
      imgui.PopTextWrapPos();
      imgui.EndTooltip();
    }
  }
};

var exports = {

  binding : {},

  ShowDemoWindow : function() {
    dear_imgui_demo_impl.ShowDemoWindow();
  }
};

var onincluded = function() {
  console.log('dear_imgui_demo onincluded...');
  var merged_exports = {};
  Object.assign(merged_exports, exports, imgui);
  return merged_exports;
};

