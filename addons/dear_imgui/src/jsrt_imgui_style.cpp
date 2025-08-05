#include "application/application.h"
#include <v8_utils.h>
#include <imgui.h>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{
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
  v8_utils::BindJsToCppFunction(obj, "GetStyleHandle", GetStyleHandleCbk);
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace