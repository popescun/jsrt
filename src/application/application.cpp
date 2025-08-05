#include "application.h"
#include "modules_loader/modules_binding.h"
#include <memory>
#include <vector>

namespace jsrt
{
std::unique_ptr<Environment> env;
std::unique_ptr<Module> mod;
std::unique_ptr<EmbeddedNode> node = nullptr;

Environment& Application::environment()
{
  if (!env)
  {
    env = std::make_unique<Environment>();
  }
  return *env;
}

Module& Application::module()
{
  if (!mod)
  {
    mod = std::make_unique<Module>();
  }
  return *mod;
}

EmbeddedNode& Application::embeddednode()
{
  if (!node)
  {
    node = std::make_unique<EmbeddedNode>();
  }
  return *node;
}

void Application::run(int argc, char* argv[])
{
  std::cout << "Application::run" << std::endl;

  // init v8 and create the isolate
  std::vector<std::string> args;
  for(int i = 0; i < argc; ++i)
  {
    args.push_back(argv[i]);
  }
  Application::environment().Init(std::move(args));
  // define the isolate scope
  V8_ISOLATE_SCOPE
  // create the global context and object
  // also create the global object's properties (e.g. process object)
  env->CreateGlobals();
  // v8 env globals can be used in other components within a context scope (V8_CONTEXT_SCOPE)
  // e.g. in Moudle constructor the global require() binding is defined
  jsrt::modules::RegisterModules();
  // run the initial script
  env->Run();
}

} // jsrt namespace