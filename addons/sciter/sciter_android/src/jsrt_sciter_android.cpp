//#include "android_native_app_glue.h"
#include "sciter_android_bridge.h"
#include "jsrt_sciter_android.h"
#include "jsrt_sciter_value.h"
#include "log.h"
#include "main.h"

#include <v8_utils.h>

#include <android/native_activity.h>

#include <thread>
#include <mutex>

struct android_app* g_android_app = nullptr;
struct engine* g_engine =  nullptr;

jsrt_sciter::dom_event_handler g_domEventHandler;

namespace jsrt_sciter
{
constexpr char NAME[] = "sciter_android";

Local<Context> g_Context;

void attachDomEventHandler()
{
  LOGI("attachDomEventHandler...");
  sciter::attach_dom_event_handler(g_engine, &g_domEventHandler);
};

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
  SciterLoadFile(g_engine, url.c_str());
}

SCITER_VALUE call_function(LPCSTR name, UINT argc, SCITER_VALUE* argv )
{
  SCITER_VALUE rv;
  BOOL r = SciterCall(g_engine, name, argc, argv, &rv);
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
  LOGI("callCbk...");
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

CPP_CALLBACK(setNativeActivityCbk)
{
  LOGI("setNativeActivityCbk...\n");

  LOGI("setNativeActivityCbk thread id:%lld", std::this_thread::get_id());

  auto activityHandle = BigInt::Cast(*args[0])->Uint64Value();
  auto activityPtr = reinterpret_cast<ANativeActivity*>(activityHandle);

  g_android_app = static_cast<android_app*>(activityPtr->instance);
  g_engine = static_cast<engine*>(g_android_app->userData);

  //sciter::attach_dom_event_handler(g_engine, &g_domEventHandler);

  /*auto savedStateHandle = BigInt::Cast(*args[1])->Uint64Value();
  auto savedStatePtr = reinterpret_cast<void*>(savedStateHandle);

  auto savedStateSize = BigInt::Cast(*args[2])->Uint64Value();

  setNativeActivity(activityPtr, savedStatePtr, savedStateSize);*/
}

std::once_flag flagOnce;
CPP_CALLBACK(displayEngineReadyCbk)
{
  LOGI("displayEngineReadyCbk...");
  main_iteration(g_engine, g_android_app);
  bool valid = (g_engine->display != nullptr);
  if (valid)
  {
    std::call_once(flagOnce, attachDomEventHandler);
  }
  args.GetReturnValue().Set(valid);
}

CPP_CALLBACK(nativeWindowExistCbk)
{
  //LOGI("nativeWindowExistCbk...\n");
  bool valid = (g_android_app->pendingWindow != nullptr);
  args.GetReturnValue().Set(valid);
}

CPP_CALLBACK(main_iterationCbk)
{
  LOGI("main_iterationCbk...\n");
  main_iteration(g_engine, g_android_app);

  /*static bool firstSet = true;
  if (g_engine->display == nullptr)
  {
    LOGI("main_iterationCbk display is null");
  }
  else if (firstSet)
  {
    firstSet = false;
    sciter::attach_dom_event_handler(g_engine, &g_domEventHandler);
  }*/
}

bool dom_event_handler::handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params)
{
  v8::Context::Scope ctxScope(g_Context);

  LOGI("dom_event_handler::handle_scripting_call...");
  //LOGI("dom_event_handler::handle_scripting_call thread id: %lld", std::this_thread::get_id());

  if (params.argc < 1)
  {
    return false;
  }

  // get js exported sciter object name
  auto sciterJsName_ws = params.argv[0].to_string();
  std::string sciterJsName(sciterJsName_ws.begin(), sciterJsName_ws.end());
  Local<Value> propertyVal;
  LOGI("dom_event_handler::handle_scripting_call Debug 1");
  if (v8_utils::GetObjectProperty(g_Context->Global(), sciterJsName.c_str(), propertyVal))
  {
    if (propertyVal->IsNull())
    {
      LOGI("sciter value is null");
      return false;
    }

    if (propertyVal->IsUndefined())
    {
      LOGI("sciter value is undefined");
      return false;
    }

    LOGI("dom_event_handler::handle_scripting_call Debug 2");

    auto sciterObj = propertyVal->ToObject(g_Context).ToLocalChecked();
    LOGI("dom_event_handler::handle_scripting_call Debug 3");
    auto args = jsrt_sciter::sciterToJsValues(g_Context->GetIsolate(), aux::slice<sciter::value>(params.argv, params.argc), 1);
    LOGI("dom_event_handler::handle_scripting_call Debug 4");
    LOGI("params.name=%s", params.name);
    auto localVal = v8_utils::CallJSFunction(sciterObj, params.name, args.data(), args.size());
    LOGI("dom_event_handler::handle_scripting_call Debug 5");
    params.result = jsrt_sciter::jsToSciterValue(g_Context->GetIsolate(), localVal);
    LOGI("dom_event_handler::handle_scripting_call Debug 6");
  }
  return true;
}

extern "C" void Bind(Handle<Object> obj, Local<Context> ctx)
{
  v8::Context::Scope ctxScope(ctx);

  LOGI("%s Bind as addon...\n", NAME);

  g_Context = ctx;

  // sciter
  v8_utils::BindJsToCppFunction(obj, "setDebugMode", setDebugModeCbk);
  v8_utils::BindJsToCppFunction(obj, "loadFile", loadFileCbk);
  v8_utils::BindJsToCppFunction(obj, "call", callCbk);
  v8_utils::BindJsToCppFunction(obj, "setNativeActivity", setNativeActivityCbk);
  v8_utils::BindJsToCppFunction(obj, "displayEngineReady", displayEngineReadyCbk);
  v8_utils::BindJsToCppFunction(obj, "nativeWindowExist", nativeWindowExistCbk);
  v8_utils::BindJsToCppFunction(obj, "main_iteration", main_iterationCbk);
}
} // jsrt_sciter namespace