#include "application/application.h"
#include <v8_utils.h>
#include <map>

using namespace v8;
using namespace v8_utils;

namespace jsrt
{
namespace modules
{
namespace jsrt_core
{
using intMap_t = std::map<std::string, uint32_t>;

static constexpr char NAME[] = "jsrt_core";
static intMap_t intMap;

CPP_CALLBACK(SetModulesDirectoryCbk)
{
  auto isol = args.GetIsolate();
  auto directory = std::string(*v8::String::Utf8Value(isol, args[0]));
  Application::environment().mModulesDirectory = directory;
}

CPP_CALLBACK(GetModulesDirectoryCbk)
{
  auto isol = args.GetIsolate();
  auto retVal = String::NewFromUtf8(isol, Application::environment().mModulesDirectory.c_str()).ToLocalChecked();
  args.GetReturnValue().Set(retVal);
}

// todo: think of a general solution
uintptr_t OpenPtr()
{
  static bool open = true;
  return reinterpret_cast<uintptr_t>(&open);
}

CPP_CALLBACK(OpenHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(OpenPtr())));
}

CPP_CALLBACK(OpenValueCbk)
{
  bool* open = reinterpret_cast<bool*>(OpenPtr());
  args.GetReturnValue().Set(*open);
}

uintptr_t IntPtr(uint32_t* val)
{
  return reinterpret_cast<uintptr_t>(val);
}

CPP_CALLBACK(IntCbk)
{
  auto isol = args.GetIsolate();
  auto intName = std::string(*v8::String::Utf8Value(isol, args[0]));
  intMap[intName] =  Number::Cast(*args[1])->Value();
  args.GetReturnValue().Set(intMap[intName]);
}

CPP_CALLBACK(GetIntCbk)
{
  auto isol = args.GetIsolate();
  auto intName = std::string(*v8::String::Utf8Value(isol, args[0]));
  args.GetReturnValue().Set(intMap[intName]);
}

CPP_CALLBACK(IntHandleCbk)
{
  auto isol = args.GetIsolate();
  auto intName = std::string(*v8::String::Utf8Value(isol, args[0]));
  auto& val = intMap[intName];
  //args.GetReturnValue().Set(static_cast<uint32_t>(IntPtr(&val)));
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(IntPtr(&val))));
}

// todo: implement remove item from intMap

void Bind(Handle<Object> obj)
{
  V8_CONTEXT_SCOPE
  std::cout << NAME << " Bind..." << std::endl;

  if (obj.IsEmpty()) {
    throw std::runtime_error("jsrt_core v8 Handle is empyt.");
  }
  v8_utils::BindJsToCppFunction(obj, "SetModulesDirectory", SetModulesDirectoryCbk); 
  v8_utils::BindJsToCppFunction(obj, "GetModulesDirectory", GetModulesDirectoryCbk);
  v8_utils::BindJsToCppFunction(obj, "OpenHandle", OpenHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "OpenValue", OpenValueCbk);
  v8_utils::BindJsToCppFunction(obj, "Int", IntCbk);
  v8_utils::BindJsToCppFunction(obj, "GetInt", GetIntCbk);
  v8_utils::BindJsToCppFunction(obj, "IntHandle", IntHandleCbk);
}
} // namespace jsrt_core
} // namespace modules
} // namespace jsrt