#include "jsrt_sciter_gtk.h"
#include "jsrt_sciter_value.h"

#include <environment/environment.h>
#include <utils/v8_utils.h>

#include <gtk/gtk.h>

int uimain(std::function<int()> init) {
  return 0;
}

void hook_uv(std::function<bool()> iterate_uv_cbk);

Local<Context> g_Context;

jsrt::Environment* g_env = nullptr;

namespace jsrt_sciter
{
static constexpr char NAME[] = "sciter_gtk";
static View* g_view = nullptr;

CPP_CALLBACK(initCbk)
{
  SciterSetOption(nullptr, SCITER_SET_SCRIPT_RUNTIME_FEATURES,
    ALLOW_FILE_IO | ALLOW_SOCKET_IO | ALLOW_EVAL | ALLOW_SYSINFO );

  SciterSetOption(nullptr, SCITER_SET_UX_THEMING, true);

  /* Initialize GTK+ */
  g_log_set_handler ("Gtk", G_LOG_LEVEL_WARNING, (GLogFunc) gtk_false, nullptr);

#if 0
  hook_uv(g_env->mIteateEventLoop);
#endif

  gtk_init (nullptr, nullptr);

  g_log_set_handler ("Gtk", G_LOG_LEVEL_WARNING, g_log_default_handler, nullptr);
}

CPP_CALLBACK(setDebugModeCbk)
{
  SciterSetOption(g_view != nullptr ? g_view->get_hwnd() : nullptr,
    SCITER_SET_DEBUG_MODE, true);
}

CPP_CALLBACK(main_iterationCbk)
{
  if (g_view->get_hwnd())
  {
    gtk_main_iteration();
  }
}

CPP_CALLBACK(loopCbk)
{
  std::cout << "gtk_main" << std::endl;
  gtk_main();
}

CPP_CALLBACK(createViewCbk)
{
  g_view = new View();
  sciter::attach_dom_event_handler(g_view->get_hwnd(), g_view);
}

CPP_CALLBACK(existViewCbk)
{
  args.GetReturnValue().Set(g_view->get_hwnd() != nullptr);
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
  auto ret = g_view->load_file(url.c_str());
}

CPP_CALLBACK(expandCbk)
{
  auto isol = args.GetIsolate();
  auto maximize = false;
  if (args.Length() == 1)
  {
    maximize = Boolean::Cast(*args[0])->Value();
    g_view->window::expand(maximize);
  }
  g_view->window::expand(maximize);
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

View::View() :
  window(SW_TITLEBAR | SW_RESIZEABLE | SW_CONTROLS | SW_MAIN | SW_GLASSY | SW_ENABLE_DEBUG)
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

extern "C" void Bind(Handle<Object> obj, jsrt::Environment* env)
{
  v8::Context::Scope ctxScope(env->mGlobalCtx);

  std::cout << NAME << " Bind as addon..." << std::endl;

  g_env = env;
  g_Context = env->mGlobalCtx;

  // sciter
  v8_utils::BindJsToCppFunction(obj, "init", initCbk);
  v8_utils::BindJsToCppFunction(obj, "setDebugMode", setDebugModeCbk);
  v8_utils::BindJsToCppFunction(obj, "main_iteration", main_iterationCbk);
  v8_utils::BindJsToCppFunction(obj, "loop", loopCbk);
  v8_utils::BindJsToCppFunction(obj, "createView", createViewCbk);
  v8_utils::BindJsToCppFunction(obj, "existView", existViewCbk);
  v8_utils::BindJsToCppFunction(obj, "loadFile", loadFileCbk);
  v8_utils::BindJsToCppFunction(obj, "expand", expandCbk);
  v8_utils::BindJsToCppFunction(obj, "collapse", collapseCbk);
  v8_utils::BindJsToCppFunction(obj, "dismiss", dismissCbk);
  v8_utils::BindJsToCppFunction(obj, "call", callCbk);
}
} // jsrt_sciter namespace