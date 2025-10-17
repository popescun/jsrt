#include "jsrt_sciter_value.h"
#include "jsrt_sciter_macos.hpp"

#include <environment/environment.h>
#include <v8_utils.h>

#include <sciter-x.h>

#include <memory>

#import <Cocoa/Cocoa.h>
#import <Foundation/Foundation.h>
#import <AppKit/NSApplication.h>

int uimain(std::function<int()> init) {
  return 0;
}

namespace jsrt_sciter
{
constexpr char NAME[] = "sciter_macos";

v8::Local<v8::Context> g_Context;

jsrt::Environment* g_env = nullptr;

View* g_view = nullptr;
NSApplication* g_application = nullptr;

CPP_CALLBACK(initCbk)
{
//  SciterSetOption(NULL,SCITER_SET_GFX_LAYER,1); // use this to force the engine to use CoreGraphics backend.

    // enable features to be used from script
  SciterSetOption(nullptr, SCITER_SET_SCRIPT_RUNTIME_FEATURES,
    ALLOW_FILE_IO | ALLOW_SOCKET_IO | ALLOW_EVAL | ALLOW_SYSINFO );


    g_application = [NSApplication sharedApplication];
//    [g_application activateIgnoringOtherApps:YES];
}

CPP_CALLBACK(createViewCbk)
{
  RECT frame;
  frame.top = 100;
  frame.left = 100;
  frame.right = 100 + 800;
  frame.bottom = 100 + 600;
  g_view = new View();
}

CPP_CALLBACK(setDebugModeCbk)
{
  SciterSetOption(nullptr, SCITER_SET_DEBUG_MODE, true);
}

CPP_CALLBACK(loadFileCbk)
{
  auto isol = args.GetIsolate();
  char16_t buf[2048] = {0};
  int copied = args[0].As<v8::String>()->Write(
                                isol,
                                reinterpret_cast<uint16_t*>(buf),
                                0,
                                sizeof(buf) - 1,
                                v8::String::NO_NULL_TERMINATION);
  buf[copied] = '\0';
  std::replace(&buf[0], &buf[copied], '\\', '/');
  sciter::string url = WSTR("file://");
  url +=  LPCWSTR(buf);
//  auto ret = g_view->load_file(url.c_str());
  g_view->load(url.c_str());
}

CPP_CALLBACK(runCbk)
{
  [g_application run];
}

NSView*   nsview(HWINDOW hwnd) { return (__bridge NSView*) hwnd; }
NSWindow* nswindow(HWINDOW hwnd) { return hwnd ? [nsview(hwnd) window]:nullptr; }

CPP_CALLBACK(expandCbk)
{
  auto isol = args.GetIsolate();
  auto maximize = false;
  if (args.Length() == 1)
  {
    maximize = v8::Boolean::Cast(*args[0])->Value();
    g_view->window::expand(maximize);
  }
  g_view->window::expand(maximize);
//  [nswindow(g_view->get_hwnd()) makeKeyAndOrderFront:nil];
  [nswindow(g_view->get_hwnd()) orderFrontRegardless];
}

CPP_CALLBACK(collapseCbk)
{
  g_view->window::collapse();
}

CPP_CALLBACK(dismissCbk)
{
  g_view->window::dismiss();
}

CPP_CALLBACK(callCbk)
{
  auto isol = args.GetIsolate();
  auto func_path = std::string(*v8::String::Utf8Value(isol, args[0]));
  sciter::value ret;
  if (args.Length() > 1)
  {
    std::vector<sciter::value> fargs = jsToSciterValues(args, 1);
    ret = g_view->call_function(func_path.c_str(), UINT(fargs.size()), fargs.data());
  }
  else
  {
    ret = g_view->call_function(func_path.c_str());
  }
  args.GetReturnValue().Set(sciterToJsValue(isol, ret));
}

View::View(RECT frame) :
  window(SW_TITLEBAR | SW_RESIZEABLE | SW_MAIN | SW_ENABLE_DEBUG, frame)
{
}

View::~View()
{
  g_view = nullptr;
}

bool View::handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params)
{
  v8::Context::Scope ctxScope(g_Context);

  std::cout << "View::handle_scripting_call..." << std::endl;

  if (params.argc < 1)
  {
    return false;
  }

  // get js exported sciter object name
  auto sciterJsName_ws = params.argv[0].to_string();
  std::string sciterJsName(sciterJsName_ws.begin(), sciterJsName_ws.end());
  v8::Local<v8::Value> propertyVal;
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

extern "C" void Bind(v8::Handle<v8::Object> obj, jsrt::Environment* env)
{
  v8::Context::Scope ctxScope(env->mGlobalCtx);

  std::cout << NAME << " Bind as addon..." << std::endl;

  g_env = env;
  g_Context = env->mGlobalCtx;

  // sciter
  v8_utils::BindJsToCppFunction(obj, "init", initCbk);
  v8_utils::BindJsToCppFunction(obj, "createView", createViewCbk);
  v8_utils::BindJsToCppFunction(obj, "loadFile", loadFileCbk);
  v8_utils::BindJsToCppFunction(obj, "run", runCbk);
  v8_utils::BindJsToCppFunction(obj, "expand", expandCbk);
  v8_utils::BindJsToCppFunction(obj, "collapse", collapseCbk);
  v8_utils::BindJsToCppFunction(obj, "dismiss", dismissCbk);
  v8_utils::BindJsToCppFunction(obj, "call", callCbk);
}
} // jsrt_sciter namespace
