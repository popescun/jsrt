#include "application/application.h"
#include <v8_utils.h>
#include <exception>
#include <unistd.h>
#include <limits.h>

namespace
{
  const std::string KInspect = "--inspect";
  const std::string KInspectBrk = "--inspect-brk";
} // anonymous namespace

namespace jsrt
{

using namespace v8;

// public interface
Environment::Environment() = default;
Environment::~Environment() = default;

std::string modulePath(const std::string& path)
{
  auto pos = path.rfind('/');
  return pos == std::string::npos ? "" : path.substr(0, pos);
}

std::string getExePath()
{
  char result[PATH_MAX];
  ssize_t count = readlink( "/proc/self/exe", result, PATH_MAX );
  return std::string( result, (count > 0) ? count : 0 );
}

// private interface
void Environment::Init(std::vector<std::string> args)
{
  if (args.size() > 3)
  {
    throw std::logic_error("invalid number of arguments");
  }
  else if (args.size() == 2) {
    mInitScriptPath = args[1];
  } else if (args.size() == 3) {
    if (args[1] != KInspect &&
        args[1].substr(0, KInspectBrk.length()) != KInspectBrk)
    {
      throw std::runtime_error(std::string("argument 1 must be:") + KInspect + " or " + KInspectBrk);
    }
    mInitScriptPath = args[2];
  }
  mInitModuleDirectory = modulePath(mInitScriptPath);
  mExecutableDirectory = modulePath(getExePath());
#ifdef WITH_V8
  mPlatform = v8_utils::Init();
  mIsolate = v8_utils::CreateIsolate();
#endif
}

void Environment::CreateGlobals()
{
  //mGlobalObj = ObjectTemplate::New(mIsolate);
#ifdef WITH_V8
  mGlobalCtx = Context::New(mIsolate);
#endif
  mGlobalObj = mGlobalCtx->Global();
  V8_CONTEXT_SCOPE
  CreateGlobalCoreObj();
}

void Environment::Run()
{
  RunScript("jsrt_modules/native/init.js");
  RunScript(mInitScriptPath);
}

void Environment::RunScript(std::string file)
{
  Context::Scope ctxScope(mGlobalCtx);
  {
    v8_utils::ExecuteScript(mGlobalCtx, file);
  }
}

// private interface
void Environment::CreateGlobalCoreObj()
{
  V8_CONTEXT_SCOPE
  mGlobalCoreObj = Object::New(mIsolate);
  (void)mGlobalCtx->Global()->Set(mGlobalCtx, String::NewFromUtf8(mIsolate, "jsrtcore").ToLocalChecked(), mGlobalCoreObj);
}
}