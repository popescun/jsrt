#include "application/application.h"
#include <v8_utils.h>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace module2
{
static constexpr char NAME[] = "module2";

CPP_CALLBACK(Cbk)
{
  auto retVal = String::NewFromUtf8(args.GetIsolate(), "Good bye World!").ToLocalChecked();
  args.GetReturnValue().Set(retVal);
}

void Bind(Handle<Object> obj)
{
  V8_CONTEXT_SCOPE
  std::cout << NAME << " Bind..." << std::endl;
  BindJsToCppFunction(obj, "sayBye", Cbk);
}
} // namespace module2
} // namespace modules
} // namespace jsrt