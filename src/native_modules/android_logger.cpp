#include "application/application.h"
#include "log.h"
#include <v8_utils.h>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace android_logger
{
static constexpr char NAME[] = "android_logger";

CPP_CALLBACK(logCbk)
{
  String::Utf8Value str(args.GetIsolate(), args[0]);
  const char* cstr = v8_utils::ToCString(str);

  std::cout << cstr << std::endl;

  LOGI("%s\n", cstr);
}

void Bind(v8::Handle<v8::Object> obj)
{
  V8_CONTEXT_SCOPE

  std::cout << NAME << " Bind..." << std::endl;

  BindJsToCppFunction(obj, "log", logCbk);
}
} // namespace android_logger
} // namespace modules
} // namespace jsrt