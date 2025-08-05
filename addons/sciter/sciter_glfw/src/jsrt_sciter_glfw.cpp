#include "jsrt_sciter_value.h"

#include <environment/environment.h>
#include <v8_utils.h>

#include <sciter-x.h>

#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <memory>

namespace jsrt_sciter
{
constexpr char NAME[] = "sciter_glfw";

Local<Context> g_Context;

jsrt::Environment* g_env = nullptr;

GLFWwindow* g_window = nullptr;

int used_width = 0, used_height = 0;

class dom_event_handler: public sciter::event_handler
{
public:
  // event_handler
  bool handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params) override;
};

std::unique_ptr<dom_event_handler> domEventHandler = std::make_unique<dom_event_handler>();

void error_callback(int error, const char* description)
{
  std::cerr << "error:" << description << std::endl;
}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods);
void char_callback(GLFWwindow* window, unsigned int codepoint);
void focus_callback(GLFWwindow* window, int got_focus);
void mouse_button_callback(GLFWwindow* window, int button, int acction, int modifiers);
void mouse_move_callback(GLFWwindow* window, double x, double y);
void mouse_enter_leave_callback(GLFWwindow *, int enter);
void mouse_wheel_callback(GLFWwindow* window, double dx, double dy);

UINT SC_CALLBACK handle_notification(LPSCITER_CALLBACK_NOTIFICATION pnm, LPVOID callbackParam);

static bool sciter_needs_drawing = true;

CPP_CALLBACK(initCbk)
{
  //SciterSetOption(nullptr, SCITER_SET_SCRIPT_RUNTIME_FEATURES,
  //  ALLOW_FILE_IO | ALLOW_SOCKET_IO | ALLOW_EVAL | ALLOW_SYSINFO );
  SciterSetOption(nullptr, SCITER_SET_UX_THEMING, true);

  glfwSetErrorCallback(error_callback);

  if (!glfwInit())
  {
    exit(EXIT_FAILURE);
  }

  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

  g_window = glfwCreateWindow(600, 900, "Sciter GLFW", nullptr, nullptr);
  if (!g_window)
  {
    glfwTerminate();
    exit(EXIT_FAILURE);
  }

  // setup event callbacks:
  glfwSetMouseButtonCallback(g_window, mouse_button_callback);
  glfwSetCursorPosCallback(g_window, mouse_move_callback);
  glfwSetCursorEnterCallback(g_window, mouse_enter_leave_callback);
  glfwSetScrollCallback(g_window, mouse_wheel_callback);
  glfwSetKeyCallback(g_window, key_callback);
  glfwSetCharCallback(g_window, char_callback);
  glfwSetWindowFocusCallback(g_window, focus_callback);

  glfwMakeContextCurrent(g_window);
  gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);
  glfwSwapInterval(1);

  // SCITER+
  // create the engine and associate it with window:
  SciterProcX(g_window, SCITER_X_MSG_CREATE(GFX_LAYER_SKIA_OPENGL,FALSE));
  // set device resoultion ( pixels per inch )
  float xscale, yscale;
  glfwGetWindowContentScale(g_window, &xscale, &yscale);
  SciterProcX(g_window, SCITER_X_MSG_RESOLUTION(UINT(96 * xscale)));
  // set surface size
  glfwGetFramebufferSize(g_window, &used_width, &used_height);
  SciterProcX(g_window, SCITER_X_MSG_SIZE(used_width, used_height));

  SciterSetCallback(g_window, handle_notification, NULL);

  sciter::attach_dom_event_handler(g_window, domEventHandler.get());
}

CPP_CALLBACK(setDebugModeCbk)
{
  SciterSetOption(nullptr, SCITER_SET_DEBUG_MODE, true);
}

CPP_CALLBACK(loadFileCbk)
{
  auto isol = args.GetIsolate();
  char16_t buf[2048] = {0};
  int copied = args[0].As<String>()->Write(
                                isol,
                                reinterpret_cast<uint16_t*>(buf),
                                0,
                                sizeof(buf) - 1,
                                String::NO_NULL_TERMINATION);
  buf[copied] = '\0';
  std::replace(&buf[0], &buf[copied], '\\', '/');
  sciter::string url = WSTR("file://");
  url += LPCWSTR(buf);
  SciterLoadFile(g_window, url.c_str());
}

SCITER_VALUE call_function(LPCSTR name, UINT argc, SCITER_VALUE* argv )
{
  SCITER_VALUE rv;
  SBOOL r = SciterCall(g_window, name, argc, argv, &rv);
#if !defined(SCITER_SUPPRESS_SCRIPT_ERROR_THROW)
  if( (r == FALSE) && rv.is_error_string())
  {
    aux::w2a u8 (rv.get(WSTR("")));
    throw sciter::script_error(u8.c_str());
  }
#endif
  assert(r); r = r;
  return rv;
}

CPP_CALLBACK(callCbk)
{
  auto isol = args.GetIsolate();
  auto func_path = std::string(*v8::String::Utf8Value(isol, args[0]));
  sciter::value ret;
  if (args.Length() > 1)
  {
    std::vector<sciter::value> fargs = jsToSciterValues(args, 1);
    ret = call_function(func_path.c_str(), UINT(fargs.size()), fargs.data());
  }
  else
  {
    ret = call_function(func_path.c_str(), 0, 0);
  }
  args.GetReturnValue().Set(sciterToJsValue(isol, ret));
}

bool dom_event_handler::handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params)
{
  v8::Context::Scope ctxScope(g_Context);

  std::cout << "dom_event_handler::handle_scripting_call..." << std::endl;

  if (params.argc < 1)
  {
    return false;
  }

  // get js exported sciter object name
  auto sciterJsName_ws = params.argv[0].to_string();
  std::string sciterJsName(sciterJsName_ws.begin(), sciterJsName_ws.end());
  Local<Value> propertyVal;
  if (v8_utils::GetObjectProperty(g_Context->Global(), sciterJsName.c_str(), propertyVal))
  {
    if (propertyVal->IsNull())
    {
      std::cout << "sciter value is null" << std::endl;
      return false;
    }

    if (propertyVal->IsUndefined())
    {
      std::cout << "sciter value is undefined" << std::endl;
      return false;
    }

    auto sciterObj = propertyVal->ToObject(g_Context).ToLocalChecked();
    auto args = jsrt_sciter::sciterToJsValues(g_Context->GetIsolate(), aux::slice<sciter::value>(params.argv, params.argc), 1);
    auto localVal = v8_utils::CallJSFunction(sciterObj, params.name, args.data(), args.size());
    params.result = jsrt_sciter::jsToSciterValue(g_Context->GetIsolate(), localVal);
  }

  return true;
}

CPP_CALLBACK(windowShouldCloseCbk)
{
  args.GetReturnValue().Set(glfwWindowShouldClose(g_window));
}

void drawFrame()
{
  UINT ticks = UINT(glfwGetTime() * 1000); // in milliseconds
  // give sciter a chance to process animations, timers and other timed things
  SciterProcX(g_window, SCITER_X_MSG_HEARTBIT(ticks));

  int width, height;
  glfwGetFramebufferSize(g_window, &width, &height);
  if (width != used_width || height != used_height)
  {
    SciterProcX(g_window, SCITER_X_MSG_SIZE(used_width = width, used_height = height));
  }

  if (sciter_needs_drawing)
  {
    sciter_needs_drawing = false;
    glViewport(0, 0, width, height);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    // SCITER - render Sciter using current OpenGL context
    SciterProcX(g_window, SCITER_X_MSG_PAINT());

    glfwSwapBuffers(g_window);
  }

  //glfwWaitEventsTimeout(0.016); // 60 FPS
  glfwPollEvents();
}

CPP_CALLBACK(drawFrameCbk)
{
  drawFrame();
}

CPP_CALLBACK(drawLoopCbk)
{
  while (!glfwWindowShouldClose(g_window))
  {
    drawFrame();
  }
}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods)
{
  KEY_EVENTS me = GLFW_RELEASE == action ? KEY_UP : KEY_DOWN;
  UINT ks = 0;
  if (mods & GLFW_MOD_SHIFT) ks |= SHIFT_KEY_PRESSED;
  if (mods & GLFW_MOD_CONTROL) ks |= CONTROL_KEY_PRESSED;
  if (mods & GLFW_MOD_ALT) ks |= ALT_KEY_PRESSED;
  SciterProcX(window, SCITER_X_MSG_KEY(me, UINT(key), KEYBOARD_STATES(ks)));
}

MOUSE_BUTTONS mbutton = MOUSE_BUTTONS(0);

void mouse_button_callback(GLFWwindow * window, int button, int action, int modifiers)
{
  MOUSE_EVENTS  me = action == GLFW_PRESS ? MOUSE_DOWN : MOUSE_UP;
  switch (button)
  {
    default:
    case GLFW_MOUSE_BUTTON_1: mbutton = MAIN_MOUSE_BUTTON; break;
    case GLFW_MOUSE_BUTTON_2: mbutton = PROP_MOUSE_BUTTON; break;
    case GLFW_MOUSE_BUTTON_3: mbutton = MIDDLE_MOUSE_BUTTON; break;
  }
  //KEYBOARD_STATES
  UINT ks = 0;
  if (modifiers & GLFW_MOD_SHIFT) ks |= SHIFT_KEY_PRESSED;
  if (modifiers & GLFW_MOD_CONTROL) ks |= CONTROL_KEY_PRESSED;
  if (modifiers & GLFW_MOD_ALT) ks |= ALT_KEY_PRESSED;

  double x, y;
  glfwGetCursorPos(window, &x, &y);

  POINT pos = {int(x),int(y)};
  SciterProcX(g_window, SCITER_X_MSG_MOUSE(me, mbutton, KEYBOARD_STATES(ks),pos));

  if (me == MOUSE_UP)
  {
    mbutton = MOUSE_BUTTONS(0);
  }
}

void mouse_move_callback(GLFWwindow* window, double x, double y)
{
  MOUSE_EVENTS me = MOUSE_MOVE;
  POINT pos = {int(x),int(y)};
  SciterProcX(g_window, SCITER_X_MSG_MOUSE(me, mbutton, KEYBOARD_STATES(0), pos));
}

void mouse_enter_leave_callback(GLFWwindow* window, int enter)
{
  MOUSE_EVENTS  me = enter ? MOUSE_ENTER : MOUSE_LEAVE;
  UINT ks = 0;
  double x, y;
  glfwGetCursorPos(window, &x, &y);

  POINT pos = {int(x),int(y)};
  SciterProcX(window, SCITER_X_MSG_MOUSE(me, MOUSE_BUTTONS(0), KEYBOARD_STATES(ks), pos));
}

void mouse_wheel_callback(GLFWwindow* window, double dx, double dy)
{
  MOUSE_EVENTS  me = MOUSE_WHEEL;
  double x, y;
  glfwGetCursorPos(window, &x, &y);

  POINT pos = {int(x),int(y)};
  dx *= 16;
  dy *= 16;
  UINT deltas = ((short)dx) << 16 | (short)dy;
  SciterProcX(window, SCITER_X_MSG_MOUSE(me, MOUSE_BUTTONS(deltas), KEYBOARD_STATES(0), pos));
}

void char_callback(GLFWwindow* window, unsigned int codepoint)
{
  KEY_EVENTS me = KEY_CHAR;
  SciterProcX(window, SCITER_X_MSG_KEY(me, codepoint, KEYBOARD_STATES(0)));
}

void focus_callback(GLFWwindow* window, int got_focus)
{
  SciterProcX(window, SCITER_X_MSG_FOCUS(!!got_focus));
}

UINT on_load_data(LPSCN_LOAD_DATA pnmld)
{
  // your custom loader is here

  LPCBYTE pb = 0; UINT cb = 0;
  aux::wchars wu = aux::chars_of(pnmld->uri);

  if (wu.like(WSTR("this://app/*")))
  {
    // try to get them from archive first
    aux::bytes adata = sciter::archive::instance().get(wu.start + 11);
    if (adata.length)
    {
      ::SciterDataReady(pnmld->hwnd, pnmld->uri, adata.start, adata.length);
    }
  }
  return LOAD_OK;
}

UINT on_data_loaded(LPSCN_DATA_LOADED pnm)
{
  return 0;
}

UINT attach_behavior(LPSCN_ATTACH_BEHAVIOR lpab)
{
  // attach native behaviors (if we have any)
  sciter::event_handler *pb = sciter::behavior_factory::create(lpab->behaviorName, lpab->element);
  if (pb)
  {
    lpab->elementTag  = pb;
    lpab->elementProc = sciter::event_handler::element_proc;
    return 1;
  }
  return 0;
}

UINT on_invalidate_rect(LPSCN_INVALIDATE_RECT pnm)
{
  sciter_needs_drawing = true;
  //glfwPostEmptyEvent();
  return 0;
}

UINT SC_CALLBACK handle_notification(LPSCITER_CALLBACK_NOTIFICATION pnm, LPVOID callbackParam)
{
  switch (pnm->code)
  {
    case SC_LOAD_DATA: return on_load_data((LPSCN_LOAD_DATA)pnm);
    case SC_DATA_LOADED: return on_data_loaded((LPSCN_DATA_LOADED)pnm);
    case SC_ATTACH_BEHAVIOR: return attach_behavior((LPSCN_ATTACH_BEHAVIOR)pnm);
    case SC_INVALIDATE_RECT: return on_invalidate_rect((LPSCN_INVALIDATE_RECT)pnm);
    case SC_ENGINE_DESTROYED: break;
  }
  return 0;
}

extern "C" void Bind(Handle<Object> obj, jsrt::Environment* env)
{
  v8::Context::Scope ctxScope(env->mGlobalCtx);

  std::cout << NAME << " Bind as addon..." << std::endl;

  g_env = env;
  g_Context = env->mGlobalCtx;

  // sciter
  v8_utils::BindJsToCppFunction(obj, "init", initCbk);
  v8_utils::BindJsToCppFunction(obj, "setDebugMode", setDebugModeCbk);
  v8_utils::BindJsToCppFunction(obj, "windowShouldClose", windowShouldCloseCbk);
  v8_utils::BindJsToCppFunction(obj, "drawFrame", drawFrameCbk);
  v8_utils::BindJsToCppFunction(obj, "loadFile", loadFileCbk);
  v8_utils::BindJsToCppFunction(obj, "call", callCbk);
  v8_utils::BindJsToCppFunction(obj, "drawLoop", drawLoopCbk);
}
} // jsrt_sciter namespace