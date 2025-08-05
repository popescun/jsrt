#include "embeddednode.h"
#include "application/application.h"
#include "modules_loader/modules_binding.h"
#include "log.h"
#include <node.h>
#include <env.h>
#include <uv.h>
#include <v8_utils.h>

namespace
{
  const std::string KInspect = "--inspect";
  const std::string KInspectBrk = "--inspect-brk";
} // anonymous namespace

namespace jsrt
{
void EmbeddedNode::Start(int argc, char* argv[])
{
  std::cout << "EmbeddedNode::Start..." << std::endl;

  int exec_argc;
  const char** exec_argv;

  auto& appEnv = Application::environment();

  //appEnv.mIterateEventLoop = untangle::bind(this, &EmbeddedNode::IterateEventLoop);

  std::vector<std::string> args;
  for(int i = 0; i < argc; ++i)
  {
    args.push_back(argv[i]);
  }

  appEnv.Init(args);

  argv = uv_setup_args(argc, argv);
  mEventLoop = uv_default_loop();

  // according to node source this will be deprecated and replaced
  node::Init(&argc, const_cast<const char**>(argv), &exec_argc, &exec_argv);

  mMultiIsolatePlatform = node::InitializeV8Platform(4);

  v8::V8::Initialize();

  node::ArrayBufferAllocator* arrayBufferAllocator = node::CreateArrayBufferAllocator();
  appEnv.mIsolate = node::NewIsolate(arrayBufferAllocator, mEventLoop);

  // enable it for node v11.12.0
  //mMultiIsolatePlatform->RegisterIsolate(appEnv.mIsolate, mEventLoop);

  // scopes
  //v8::Isolate::Scope isolate_scope(appEnv.mIsolate);
  v8::HandleScope scope(appEnv.mIsolate);

  v8::Handle<v8::ObjectTemplate> global_template = v8::ObjectTemplate::New(appEnv.mIsolate);
  appEnv.mGlobalCtx = node::NewContext(appEnv.mIsolate, global_template);
  //v8::Context::Scope context_scope(appEnv.mGlobalCtx);

  appEnv.mGlobalObj = appEnv.mGlobalCtx->Global();
  appEnv.CreateGlobals();
  jsrt::modules::RegisterModules();
  Application::module().BindCoreObj();

  mEnv = node::CreateEnvironment(
    node::CreateIsolateData(appEnv.mIsolate, mEventLoop, mMultiIsolatePlatform),
    appEnv.mGlobalCtx , argc, argv, exec_argc, exec_argv);

  int exitCode = 1;

  // start debug inspector: from node.cc StartNodeWithIsolate
//#if !defined(NDEBUG) && 0 // todo: disable on android
#if !defined(NDEBUG) && 0
  if (args.size() == 3 &&
      (args[1] == KInspect || args[1].substr(0, KInspectBrk.length()) == KInspectBrk))
  {
    CHECK(!mEnv->inspector_agent()->IsListening());
    // Inspector agent can't fail to start, but if it was configured to listen
    // right away on the websocket port and fails to bind/etc, this will return
    // false.
    mEnv->inspector_agent()->Start(args.size() > 1 ? args[1].c_str() : "",
                                   mEnv->options()->debug_options(),
                                   mEnv->inspector_host_port(),
                                   true);
    if (mEnv->options()->debug_options().inspector_enabled &&
        !mEnv->inspector_agent()->IsListening())
    {
      exitCode = 12;  // Signal internal error.
    }
  }
#endif

  node::LoadEnvironment(mEnv);

  if (exitCode == 1)
  {
    while (true)
    {
      if (!IterateEventLoop())
      {
        break;
      }
    }
  }

  exitCode = node::EmitExit(mEnv);
  node::RunAtExit(mEnv);
  mMultiIsolatePlatform->DrainTasks(appEnv.mIsolate);
  mMultiIsolatePlatform->CancelPendingDelayedTasks(appEnv.mIsolate);
  mMultiIsolatePlatform->UnregisterIsolate(appEnv.mIsolate);
  node::FreeEnvironment(mEnv);
}

bool EmbeddedNode::IterateEventLoop()
{
  //std::cout << "EmbeddedNode::IterateEventLoop..." << std::endl;

  auto& appEnv = Application::environment();

  //more = uv_iteration(appEnv.mIsolate);
  bool more = uv_run(mEventLoop, UV_RUN_ONCE);

  mMultiIsolatePlatform->DrainTasks(appEnv.mIsolate);

  if (more == false)
  {
    node::EmitBeforeExit(mEnv);
    // Emit `beforeExit` if the loop became alive either after emitting
    // event, or after running some callbacks.
    more = uv_loop_alive(mEventLoop);
    if (uv_run(mEventLoop, UV_RUN_NOWAIT) != 0)
    {
      more = true;
    }
  }

  return more;
}
} // jsrt namespace