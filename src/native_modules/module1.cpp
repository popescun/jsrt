#include "application/application.h"
#include "log.h"
#include <v8_utils.h>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace module1
{
static constexpr char NAME[] = "module1";

CPP_CALLBACK(Cbk)
{
#ifdef __ANDROID__
  LOGI("%s\n", "Hello World!");
#endif
  auto retVal = String::NewFromUtf8(Application::environment().mIsolate, "Hello World!").ToLocalChecked();
  args.GetReturnValue().Set(retVal);
}

void Bind(Handle<Object> obj)
{
  V8_CONTEXT_SCOPE
  std::cout << NAME << " Bind..." << std::endl;
  BindJsToCppFunction(obj, "sayHello", Cbk);
}
} // namespace module1
} // namespace modules
} // namespace jsrt