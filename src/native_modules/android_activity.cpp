#include "application/application.h"
#include "log.h"
#include <v8_utils.h>

#include <android/native_activity.h>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace android_activity
{
static constexpr char NAME[] = "android_activity";

CPP_CALLBACK(getNativeActivityCbk)
{
  LOGI("%s\n", "getNativeActivityCbk");
  if (Application::environment().mActivity)
  {
    auto isol = args.GetIsolate();
    auto activityPtr = reinterpret_cast<uintptr_t>(Application::environment().mActivity);
    LOGI("activityHandle=%lld\n", static_cast<uint64_t>(activityPtr));
    args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(activityPtr)));
  }
}

CPP_CALLBACK(getSavedStateCbk)
{
  auto isol = args.GetIsolate();
  auto savedStatePtr = reinterpret_cast<uintptr_t>(Application::environment().mSavedState);
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(savedStatePtr)));
}

CPP_CALLBACK(getSavedStateSizeCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, Application::environment().mSavedStateSize));
}

void Bind(v8::Handle<v8::Object> obj)
{
  V8_CONTEXT_SCOPE

  std::cout << NAME << " Bind..." << std::endl;

  BindJsToCppFunction(obj, "getNativeActivity", getNativeActivityCbk);
  BindJsToCppFunction(obj, "getSavedState", getSavedStateCbk);
  BindJsToCppFunction(obj, "getSavedStateSize", getSavedStateSizeCbk);
}
} // namespace android_activity
} // namespace modules
} // namespace jsrt