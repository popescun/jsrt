#pragma once

#include "environment/environment.h"
#include "modules_loader/module_loader.h"
#include "node/embeddednode.h"

namespace jsrt
{
// todo: check why forward declaration does not work?
//class Environment;
//class Module;
class Application
{
public:
  static Environment& environment();
  static Module& module();
  static EmbeddedNode& embeddednode();
  static void run(int argc, char* argv[]);
};
} // jsrt namespace

#define V8_ISOLATE_SCOPE v8::HandleScope isolScope(jsrt::Application::environment().mIsolate);
#define V8_CONTEXT_SCOPE v8::Context::Scope ctxScope(jsrt::Application::environment().mGlobalCtx);