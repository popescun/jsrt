#include "application/application.h"
#include <v8_utils.h>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace console
{
static constexpr char NAME[] = "console";

CPP_CALLBACK(logCbk)
{
  // there should be one argument passed from the JS land
  if (args.Length() == 1)
  {
    String::Utf8Value str(args.GetIsolate(), args[0]);
    const char* cstr = v8_utils::ToCString(str);
    std::cout << cstr << std::endl;
  }
}

void Bind(v8::Handle<v8::Object> obj)
{
  V8_CONTEXT_SCOPE
  std::cout << NAME << " Bind..." << std::endl;
  BindJsToCppFunction(obj, "log", logCbk);
}
} // namespace console
} // namespace modules
} // namespace jsrt