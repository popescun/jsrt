#include <environment/environment.h>
#include <utils/v8_utils.h>

#include <GLFW/glfw3.h>

#include <iostream>

#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl2.h"

v8::Local<v8::Context> g_Context;

jsrt::Environment* g_env = nullptr;

namespace jsrt::modules::dear_imgui
{

using v8::Handle;
using v8::Object;
using v8::String;
using v8::Number;
using v8::BigInt;
using v8::Value;

// todo: move these to a header and get rid of extern
extern void BindTypes(Handle<Object> obj);
extern void BindWidgets(Handle<Object> obj);
extern void BindIO(Handle<Object> obj);
extern void BindStyle(Handle<Object> obj);
extern void BindDraw(Handle<Object> obj);

constexpr char NAME[] = "dear_imgui";
ImVec4 clear_color = ImVec4(0.45f, 0.55f, 0.60f, 1.00f);

static void glfw_error_callback(int error, const char* description)
{
  fprintf(stderr, "Glfw Error %d: %s\n", error, description);
}

CPP_CALLBACK(CreateContextCbk)
{
  ImGui::CreateContext();

  //todo: make a binding
  ImGui::StyleColorsDark();
}

static GLFWwindow* g_window = nullptr;

CPP_CALLBACK(GlfwInitCbk)
{
  bool ret = true;
  // Setup window
  glfwSetErrorCallback(glfw_error_callback);
  if (!glfwInit())
  {
    ret = false;
  }
  g_window = glfwCreateWindow(1280, 720, "Dear ImGui GLFW+OpenGL2 example", nullptr, nullptr);
  if (g_window == nullptr)
  {
    ret = false;
  }
  glfwMakeContextCurrent(g_window);
  glfwSwapInterval(1); // Enable vsync

  args.GetReturnValue().Set(ret);
}

CPP_CALLBACK(GlfwMakeContextCurrentCbk)
{
  glfwMakeContextCurrent(g_window);
}

CPP_CALLBACK(GlfwSwapBuffersCbk)
{
  glfwSwapBuffers(g_window);
}

CPP_CALLBACK(GlfwWindowShouldCloseCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(glfwWindowShouldClose(g_window));
}

CPP_CALLBACK(GlfwPollEventsCbk)
{
  glfwPollEvents();
}

CPP_CALLBACK(ImGui_ImplGlfw_InitForOpenGLCbk)
{
  /*Handle<Value> value = args[0];
  auto winHandle = Uint32::Cast(*value)->Value();
  g_window = reinterpret_cast<GLFWwindow*>(winHandle);*/
  ImGui_ImplGlfw_InitForOpenGL(g_window, true);
}

CPP_CALLBACK(ImGui_ImplOpenGL2_InitCbk) {
  ImGui_ImplOpenGL2_Init();
}

CPP_CALLBACK(ImGui_ImplOpenGL2_NewFrameCbk) {
  ImGui_ImplOpenGL2_NewFrame();
}

CPP_CALLBACK(ImGui_ImplGlfw_NewFrameCbk)
{
  ImGui_ImplGlfw_NewFrame();
}

CPP_CALLBACK(NewFrameCbk)
{
  ImGui::NewFrame();
}

CPP_CALLBACK(BeginCbk)
{
  static bool no_titlebar = false;
  static bool no_scrollbar = false;
  static bool no_menu = false;
  static bool no_move = false;
  static bool no_resize = false;
  static bool no_collapse = false;
  static bool no_close = false;
  static bool no_nav = false;
  static bool no_background = false;
  static bool no_bring_to_front = false;

  ImGuiWindowFlags window_flags = 0;
  if (no_titlebar)        window_flags |= ImGuiWindowFlags_NoTitleBar;
  if (no_scrollbar)       window_flags |= ImGuiWindowFlags_NoScrollbar;
  if (!no_menu)           window_flags |= ImGuiWindowFlags_MenuBar;
  if (no_move)            window_flags |= ImGuiWindowFlags_NoMove;
  if (no_resize)          window_flags |= ImGuiWindowFlags_NoResize;
  if (no_collapse)        window_flags |= ImGuiWindowFlags_NoCollapse;
  if (no_nav)             window_flags |= ImGuiWindowFlags_NoNav;
  if (no_background)      window_flags |= ImGuiWindowFlags_NoBackground;
  if (no_bring_to_front)  window_flags |= ImGuiWindowFlags_NoBringToFrontOnFocus;

  auto isol = args.GetIsolate();
  auto name = std::string(*v8::String::Utf8Value(isol, args[0]));
  ImGui::Begin(name.c_str(), nullptr, window_flags);
}

CPP_CALLBACK(EndCbk)
{
  ImGui::End();
}

// todo: rename to OpenGL_Clear
CPP_CALLBACK(RenderCbk)
{
  // clear background
  // int display_w, display_h;
  // glfwGetFramebufferSize(g_window, &display_w, &display_h);
  // glViewport(0, 0, display_w, display_h);
  glClearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
  glClear(GL_COLOR_BUFFER_BIT);
}

CPP_CALLBACK(ImGui_ImplOpenGL2_RenderDrawDataCbk)
{
  ImGui::Render();
  ImGui_ImplOpenGL2_RenderDrawData(ImGui::GetDrawData());
}

CPP_CALLBACK(VersionCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isol, IMGUI_VERSION).ToLocalChecked());
}

CPP_CALLBACK(IndentCbk)
{
  auto isol = args.GetIsolate();
  auto indent_w = Number::Cast(*args[0])->Value();
  ImGui::Indent(indent_w);
}

CPP_CALLBACK(UnindentCbk)
{
  auto isol = args.GetIsolate();
  auto indent_w = Number::Cast(*args[0])->Value();
  ImGui::Unindent(indent_w);
}

CPP_CALLBACK(GetTimeCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetTime());
}

CPP_CALLBACK(IsKeyPressedCbk)
{
  auto isol = args.GetIsolate();
  auto userKeyIndex = Number::Cast(*args[0])->Value();
  args.GetReturnValue().Set(ImGui::IsKeyPressed(static_cast<ImGuiKey>(userKeyIndex)));
}

CPP_CALLBACK(GetKeyIndexCbk)
{
  auto isol = args.GetIsolate();
  auto key = Number::Cast(*args[0])->Value();
  // args.GetReturnValue().Set(ImGui::GetKeyIndex(key));
  args.GetReturnValue().Set(key);
}


CPP_CALLBACK(IsItemHoveredCbk)
{
  args.GetReturnValue().Set(ImGui::IsItemHovered());
}

CPP_CALLBACK(BeginTooltipCbk)
{
  ImGui::BeginTooltip();
}

CPP_CALLBACK(EndTooltipCbk)
{
  ImGui::EndTooltip();
}

CPP_CALLBACK(PushTextWrapPosCbk)
{
  auto isol = args.GetIsolate();
  auto wrap_pos_x = Number::Cast(*args[0])->Value();
  ImGui::PushTextWrapPos(wrap_pos_x);
}

CPP_CALLBACK(PopTextWrapPosCbk)
{
  ImGui::PopTextWrapPos();
}

CPP_CALLBACK(GetFontSizeCbk)
{
  args.GetReturnValue().Set(ImGui::GetFontSize());
}

CPP_CALLBACK(PushItemWidthCbk)
{
  auto isol = args.GetIsolate();
  auto item_width = Number::Cast(*args[0])->Value();
  ImGui::PushItemWidth(item_width);
}

CPP_CALLBACK(GetWindowWidthCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetWindowWidth());
}

uintptr_t GetFontPtr()
{
  return reinterpret_cast<uintptr_t>(ImGui::GetFont());
}

CPP_CALLBACK(GetFontHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(GetFontPtr())));
}

CPP_CALLBACK(GetFontDebugNameCbk)
{
  auto isol = args.GetIsolate();
  //auto fontHandle = Uint32::Cast(*args[0])->Value();
  auto fontHandle = BigInt::Cast(*args[0])->Uint64Value();
  auto fontPtr = reinterpret_cast<ImFont*>(fontHandle);
  args.GetReturnValue().Set(String::NewFromUtf8(isol, fontPtr->GetDebugName()).ToLocalChecked());
}

// native demo window
CPP_CALLBACK(ShowNativeDemoWindowCbk)
{
  auto isol = args.GetIsolate();
  Handle<Value> value = args[0];
  //auto openHandle = Uint32::Cast(*value)->Value();
  auto openHandle = BigInt::Cast(*value)->Uint64Value();
  //std::cout << "cpp openHandle=" << openHandle << std::endl;
  bool* open = reinterpret_cast<bool*>(openHandle);
  //std::cout << "open=" << *open << std::endl;
  if (open && *open)
  {
    ImGui::ShowDemoWindow(open);
  }
}

extern "C" void Bind(Handle<Object> obj, jsrt::Environment* env)
{
  v8::Context::Scope ctxScope(env->mGlobalCtx);

  std::cout << NAME << " Bind as addon..." << std::endl;

  g_env = env;
  g_Context = env->mGlobalCtx;

  v8_utils::BindJsToCppFunction(obj, "GlfwInit", GlfwInitCbk);
  v8_utils::BindJsToCppFunction(obj, "GlfwMakeContextCurrent", GlfwMakeContextCurrentCbk);
  v8_utils::BindJsToCppFunction(obj, "GlfwSwapBuffers", GlfwSwapBuffersCbk);
  v8_utils::BindJsToCppFunction(obj, "GlfwWindowShouldClose", GlfwWindowShouldCloseCbk);
  v8_utils::BindJsToCppFunction(obj, "GlfwPollEvents", GlfwPollEventsCbk);
  v8_utils::BindJsToCppFunction(obj, "CreateContext", CreateContextCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGui_ImplGlfw_InitForOpenGL", ImGui_ImplGlfw_InitForOpenGLCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGui_ImplOpenGL2_Init", ImGui_ImplOpenGL2_InitCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGui_ImplOpenGL2_NewFrame", ImGui_ImplOpenGL2_NewFrameCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGui_ImplGlfw_NewFrame", ImGui_ImplGlfw_NewFrameCbk);
  v8_utils::BindJsToCppFunction(obj, "NewFrame", NewFrameCbk);
  v8_utils::BindJsToCppFunction(obj, "Begin", BeginCbk);
  v8_utils::BindJsToCppFunction(obj, "End", EndCbk);
  v8_utils::BindJsToCppFunction(obj, "Render", RenderCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGui_ImplOpenGL2_RenderDrawData", ImGui_ImplOpenGL2_RenderDrawDataCbk);
  v8_utils::BindJsToCppFunction(obj, "Version", VersionCbk);
  v8_utils::BindJsToCppFunction(obj, "Indent", IndentCbk);
  v8_utils::BindJsToCppFunction(obj, "Unindent", UnindentCbk);
  v8_utils::BindJsToCppFunction(obj, "GetTime", GetTimeCbk);
  v8_utils::BindJsToCppFunction(obj, "IsKeyPressed", IsKeyPressedCbk);
  v8_utils::BindJsToCppFunction(obj, "GetKeyIndex", GetKeyIndexCbk);
  v8_utils::BindJsToCppFunction(obj, "IsItemHovered", IsItemHoveredCbk);
  v8_utils::BindJsToCppFunction(obj, "BeginTooltip", BeginTooltipCbk);
  v8_utils::BindJsToCppFunction(obj, "EndTooltip", EndTooltipCbk);
  v8_utils::BindJsToCppFunction(obj, "PushTextWrapPos", PushTextWrapPosCbk);
  v8_utils::BindJsToCppFunction(obj, "PopTextWrapPos", PopTextWrapPosCbk);
  v8_utils::BindJsToCppFunction(obj, "GetFontSize", GetFontSizeCbk);
  v8_utils::BindJsToCppFunction(obj, "PushItemWidth", PushItemWidthCbk);
  v8_utils::BindJsToCppFunction(obj, "GetWindowWidth", GetWindowWidthCbk);
  v8_utils::BindJsToCppFunction(obj, "GetFontHandle", GetFontHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "GetFontDebugName", GetFontDebugNameCbk);

  //demos
  v8_utils::BindJsToCppFunction(obj, "ShowNativeDemoWindow", ShowNativeDemoWindowCbk);

  BindTypes(obj);
  BindWidgets(obj);
  BindIO(obj);
  BindStyle(obj);
  BindDraw(obj);
}
} // dear_imgui namespace
// modules namespace
// jsrt namespace