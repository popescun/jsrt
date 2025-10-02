'use strict';
// invesigate: imgui needs to be included before glfw-raub?
const MODULES_PARENT_DIR = __dirname + '/../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
const imgui = include('dear_imgui/dear_imgui_demo');
const glfw = require('glfw-raub');

const { Window } = glfw;

const w1 = new Window({ title: 'GLFW Simple Test 1' });
w1.makeCurrent();

imgui.ImGui_ImplGlfw_InitForOpenGL(w1.handle);
//imgui.ImGui_ImplGlfw_InitForOpenGL();
imgui.ImGui_ImplOpenGL2_Init();

const draw = () => {

  // imgui.ImGui_ImplOpenGL2_NewFrame();
  imgui.ImGui_ImplGlfw_NewFrame();
  imgui.NewFrame();

  imgui.ShowDemoWindow();

  if (jsrtcore.OpenValue() === true) {
    //console.log('js openHandle=' + jsrtcore.OpenHandle());
    imgui.ShowNativeDemoWindow(jsrtcore.OpenHandle());
  }

  imgui.Render();
  imgui.ImGui_ImplOpenGL2_RenderDrawData();

  w1.makeCurrent();
  w1.swapBuffers();

  glfw.pollEvents();  
};

const animate = () => {
  if (!( w1.shouldClose || w1.getKey(glfw.KEY_ESCAPE))) {  
    draw();
    setTimeout(animate, 16);
  } else {
    // Close OpenGL window and terminate GLFW
    w1.destroy();

    glfw.terminate();

    process.exit(0);
  }
};

animate();
