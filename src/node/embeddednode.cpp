#include "embeddednode.h"
#include "application/application.h"
#include "log.h"
#include "modules_loader/modules_binding.h"

#include <env.h>
#include <node.h>
#include <uv.h>
#include <v8_utils.h>

#include <memory>

namespace {
const std::string KInspect = "--inspect";
const std::string KInspectBrk = "--inspect-brk";
} // anonymous namespace

namespace jsrt {

using namespace v8;

int EmbeddedNode::Start(int argc, char *argv[]) {
  std::cout << "EmbeddedNode::Start...\n";

  auto &app_env = Application::environment();

  const std::vector<std::string> args(argv, argv + argc);

  app_env.Init(args);

  const auto init_result = node::InitializeOncePerProcess(
      args, {node::ProcessInitializationFlags::kNoInitializeV8,
             node::ProcessInitializationFlags::kNoInitializeNodeV8Platform});

  for (const std::string &error : init_result->errors()) {
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  }

  const auto platform = node::MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Setup up a libuv event loop, v8::Isolate, and Node.js Environment.
  std::vector<std::string> errors;
  std::unique_ptr<node::CommonEnvironmentSetup> env_setup =
      node::CommonEnvironmentSetup::Create(platform.get(), &errors,
                                           init_result->args(),
                                           init_result->exec_args());

  int ret = 1;
  if (!env_setup) {
    for (const std::string &err : errors) {
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    }
    return ret;
  }

  app_env.mIsolate = env_setup->isolate();

  {
    Locker locker(app_env.mIsolate);
    Isolate::Scope isolate_scope(app_env.mIsolate);
    HandleScope scope(app_env.mIsolate);

    app_env.mGlobalCtx = env_setup->context();

    Context::Scope context_scope(app_env.mGlobalCtx);

    app_env.mGlobalObj = app_env.mGlobalCtx->Global();
    app_env.CreateGlobals();
    modules::RegisterModules();
    Application::module().BindCoreObj();

    (void)node::LoadEnvironment(env_setup->env(),  node::StartExecutionCallback{});

    ret = RunNodeInstance(env_setup.get(), init_result->args());

    V8::Dispose();
    V8::DisposePlatform();
    node::TearDownOncePerProcess();
  }
  return ret;
}

int EmbeddedNode::RunNodeInstance(const node::CommonEnvironmentSetup *setup,
                                  const std::vector<std::string> &args) {
  int exit_code = 0;

  Isolate *isolate = setup->isolate();
  node::Environment *env = setup->env();

  // start debug inspector: from node.cc StartNodeWithIsolate
  // #if !defined(NDEBUG) && 0 // todo: disable on android
  // #if !defined(NDEBUG) && 0
  //   if (args.size() == 3 &&
  //       (args[1] == KInspect || args[1].substr(0, KInspectBrk.length()) ==
  //       KInspectBrk))
  //   {
  //     CHECK(!mEnv->inspector_agent()->IsListening());
  //     // Inspector agent can't fail to start, but if it was configured to
  //     listen
  //     // right away on the websocket port and fails to bind/etc, this will
  //     return
  //     // false.
  //     mEnv->inspector_agent()->Start(args.size() > 1 ? args[1].c_str() : "",
  //                                    mEnv->options()->debug_options(),
  //                                    mEnv->inspector_host_port(),
  //                                    true);
  //     if (mEnv->options()->debug_options().inspector_enabled &&
  //         !mEnv->inspector_agent()->IsListening())
  //     {
  //       exitCode = 12;  // Signal internal error.
  //     }
  //   }
  // #endif

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    Context::Scope context_scope(setup->context());

    exit_code = node::SpinEventLoop(env).FromMaybe(1);
  }

  node::Stop(env);

  return exit_code;
}

} // namespace jsrt