'use strict';
const MODULES_PARENT_DIR = __dirname + '/../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
// invesigate: imgui needs to be included before glfw-raub?
const imgui = include('dear_imgui/dear_imgui_demo');

imgui.GlfwInit();
imgui.CreateContext();

imgui.ImGui_ImplGlfw_InitForOpenGL();
imgui.ImGui_ImplOpenGL2_Init();

const draw = () => {

  imgui.GlfwPollEvents();

  imgui.ImGui_ImplOpenGL2_NewFrame();
  imgui.ImGui_ImplGlfw_NewFrame();
  imgui.NewFrame();

  imgui.ShowDemoWindow();

  if (jsrtcore.OpenValue() === true) {
    //console.log('js openHandle=' + jsrtcore.OpenHandle());
    imgui.ShowNativeDemoWindow(jsrtcore.OpenHandle());
  }

  imgui.Render();
  imgui.ImGui_ImplOpenGL2_RenderDrawData();

  imgui.GlfwMakeContextCurrent();
  imgui.GlfwSwapBuffers();

};

const animate = () => {
  //if (!( w1.shouldClose || w1.getKey(glfw.KEY_ESCAPE))) {
    if (!imgui.GlfwWindowShouldClose()) {
    draw();
    setTimeout(animate, 16);
  } else {
    // Close OpenGL window and terminate GLFW
    //w1.destroy();

    //glfw.terminate();

    process.exit(0);
  }
};

animate();
