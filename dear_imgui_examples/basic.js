'use strict';
const MODULES_PARENT_DIR = __dirname + '/../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
const imgui = include('dear_imgui/dear_imgui');
const glfw = require('glfw-raub');

const { Window } = glfw;

const w1 = new Window({ title: 'GLFW Simple Test 1' });

w1.makeCurrent();

//console.log('window handle=' + w1.handle);

// testing events
//w1.on('keydown', () => w1.height += 10);
//w1.on('mousedown', () => w1.width += 10);

imgui.CreateContext();
imgui.ImGui_ImplGlfw_InitForOpenGL(w1.handle);
imgui.ImGui_ImplOpenGL2_Init();

//console.log('Press a key to resize Height.\nClick mouse to resize Width.');
var counter = 0;
var textColor = new imgui.ImVec4(0.0, 0.8, 0.8, 1.0);
const draw = () => {
//const wsize1 = w1.framebufferSize;

  // imgui.ImGui_ImplOpenGL2_NewFrame();
  imgui.ImGui_ImplGlfw_NewFrame();
  imgui.NewFrame();

  //console.log('OpenValue=' + jsrtcore.OpenValue());
  //console.log('JS OpenHandle=' + jsrtcore.OpenHandle());
  if (jsrtcore.OpenValue() === true) {
    imgui.ShowNativeDemoWindow(jsrtcore.OpenHandle());
  }

  imgui.Begin('Test window');

  imgui.Text('This is some useful text.');
  imgui.TextColored(textColor, 'This is some useful colored text.');
  if (imgui.Button('Button')) {
    counter++;
  }
  imgui.SameLine();
  imgui.Text('counter = ' + counter);

  imgui.End();

  imgui.Render();
  imgui.ImGui_ImplOpenGL2_RenderDrawData();

  w1.makeCurrent();
  w1.swapBuffers();

  // glfw.makeContextCurrent(w1.handle);
  // glfw.swapBuffers(w1);

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
