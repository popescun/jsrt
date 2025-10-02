#include <environment/environment.h>
#include <utils/v8_utils.h>
#include <imgui.h>

#include <iostream>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{

using namespace v8;

constexpr char NAME[] = "dear_imgui_style";

uintptr_t GetStylePtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetStyle());
}

CPP_CALLBACK(GetStyleHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(static_cast<uint32_t>(GetStylePtr()));
}

void BindStyle(Handle<Object> obj)
{
  std::cout << NAME << " Bind as addon..." << std::endl;

  v8_utils::BindJsToCppFunction(obj, "GetStyleHandle", GetStyleHandleCbk);
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace