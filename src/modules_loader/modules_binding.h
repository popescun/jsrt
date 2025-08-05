#pragma once

#include "application/application.h"
#include <include/v8.h>

namespace jsrt
{
namespace modules
{
#define DECLARE_BIND(name) \
namespace name \
{ \
  void Bind(v8::Handle<v8::Object> obj); \
} \

#define REGISTER_BIND_ACTION(name) \
static jsrt::Module::actionT actionBind##name = name::Bind; \
jsrt::Application::module().RegisterBindAction(#name, &actionBind##name); \

DECLARE_BIND(jsrt_core)
#ifdef WITH_V8
DECLARE_BIND(console)
#endif
#ifdef __ANDROID__
DECLARE_BIND(android_logger)
DECLARE_BIND(android_activity)
#endif
DECLARE_BIND(module1)
DECLARE_BIND(module2)
//DECLARE_BIND(dear_imgui)
static void RegisterModules()
{
  REGISTER_BIND_ACTION(jsrt_core)
#ifdef __ANDROID__
  REGISTER_BIND_ACTION(android_logger)
  REGISTER_BIND_ACTION(android_activity)
#endif
#ifdef WITH_V8
  REGISTER_BIND_ACTION(console)
#endif
  REGISTER_BIND_ACTION(module1)
  REGISTER_BIND_ACTION(module2)
  //REGISTER_BIND_ACTION(dear_imgui)
}
} // modules namespace
} // jsrt namespace