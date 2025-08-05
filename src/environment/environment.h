#pragma once

#include <include/v8.h>

#include <functional>
#include <map>
#include <memory>
#include <vector>


#ifdef __ANDROID__
#include <android/native_activity.h>
#endif

namespace jsrt
{
class Environment
{
public:
  Environment();
  ~Environment();
  void Init(std::vector<std::string> args);
  void CreateGlobals();
  void Run();
  void RunScript(std::string file);

  std::unique_ptr<v8::Platform> mPlatform;
  v8::Isolate* mIsolate = nullptr;
  v8::Handle<v8::Object> mGlobalObj;
  v8::Handle<v8::Context> mGlobalCtx;
  v8::Handle<v8::Object> mGlobalCoreObj;
  v8::Handle<v8::Object> mSciterObj;
  std::string mInitScriptPath;
  std::string mInitModuleDirectory;
  std::string mExecutableDirectory;
  std::string mModulesDirectory;
  std::function<bool(void)> mIterateEventLoop;


#ifdef __ANDROID__
  ANativeActivity* mActivity = nullptr;
  void* mSavedState;
  size_t mSavedStateSize;
#endif

private:
  void CreateGlobalCoreObj();
};
} // jsrt namespace