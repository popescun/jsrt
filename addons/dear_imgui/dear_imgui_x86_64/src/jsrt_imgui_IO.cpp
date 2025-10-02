#include "application/application.h"
#include <v8_utils.h>
#include <imgui.h>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{
uintptr_t GetIOPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO());
}

CPP_CALLBACK(GetIOHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(GetIOPtr())));
}

uintptr_t ImGuiIO_ConfigFlags_Ptr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().ConfigFlags);
}

CPP_CALLBACK(ImGuiIO_ConfigFlags_HandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ImGuiIO_ConfigFlags_Ptr())));
}

uintptr_t ImGuiIO_BackendFlags_Ptr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().BackendFlags);
}

CPP_CALLBACK(ImGuiIO_BackendFlags_HandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ImGuiIO_BackendFlags_Ptr())));
}

CPP_GETTER_ACCESSOR_NAME(ImGuiIO_ConfigFlags_GetterCbk)
{
  //std::cout << "ImGuiIO_ConfigFlags_GetterCbk..." << std::endl;
  info.GetReturnValue().Set(ImGui::GetIO().ConfigFlags);
}

CPP_SETTER_ACCESSOR_NAME(ImGuiIO_ConfigFlags_SetterCbk)
{
  //std::cout << "ImGuiIO_ConfigFlags_SetterCbk..." << std::endl;
  const auto isol = info.GetIsolate();
  const auto curCtx = isol->GetCurrentContext();
  ImGui::GetIO().ConfigFlags = value->Int32Value(curCtx).ToChecked();
}

CPP_GETTER_ACCESSOR_NAME(ImGuiIO_BackendFlags_GetterCbk)
{
  info.GetReturnValue().Set(ImGui::GetIO().BackendFlags);
}

CPP_SETTER_ACCESSOR_NAME(ImGuiIO_BackendFlags_SetterCbk)
{
  const auto isol = info.GetIsolate();
  const auto curCtx = isol->GetCurrentContext();
  ImGui::GetIO().BackendFlags = value->Int32Value(curCtx).ToChecked();
}

CPP_CALLBACK(MouseDrawCursorCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetIO().MouseDrawCursor);
}

uintptr_t MouseDrawCursorPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().MouseDrawCursor);
}

CPP_CALLBACK(MouseDrawCursorHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(MouseDrawCursorPtr())));
}

CPP_CALLBACK(ConfigMacOSXBehaviorsCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetIO().ConfigMacOSXBehaviors);
}

uintptr_t ConfigMacOSXBehaviorsPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().ConfigMacOSXBehaviors);
}

CPP_CALLBACK(ConfigMacOSXBehaviorsHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ConfigMacOSXBehaviorsPtr())));
}

CPP_CALLBACK(ConfigInputTextCursorBlinkCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetIO().ConfigInputTextCursorBlink);
}

uintptr_t ConfigInputTextCursorBlinkPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().ConfigInputTextCursorBlink);
}

CPP_CALLBACK(ConfigInputTextCursorBlinkHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ConfigInputTextCursorBlinkPtr())));
}

CPP_CALLBACK(ConfigWindowsResizeFromEdgesCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetIO().ConfigWindowsResizeFromEdges);
}

uintptr_t ConfigWindowsResizeFromEdgesPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().ConfigWindowsResizeFromEdges);
}

CPP_CALLBACK(ConfigWindowsResizeFromEdgesHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ConfigWindowsResizeFromEdgesPtr())));
}

CPP_CALLBACK(ConfigWindowsMoveFromTitleBarOnlyCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(ImGui::GetIO().ConfigWindowsMoveFromTitleBarOnly);
}

uintptr_t ConfigWindowsMoveFromTitleBarOnlyPtr()
{
  return reinterpret_cast<uintptr_t>(&ImGui::GetIO().ConfigWindowsMoveFromTitleBarOnly);
}

CPP_CALLBACK(ConfigWindowsMoveFromTitleBarOnlyHandleCbk)
{
  auto isol = args.GetIsolate();
  args.GetReturnValue().Set(BigInt::NewFromUnsigned(isol, static_cast<uint64_t>(ConfigWindowsMoveFromTitleBarOnlyPtr())));
}

void BindIO(Handle<Object> obj)
{
  v8_utils::BindJsToCppFunction(obj, "GetIOHandle", GetIOHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGuiIO_ConfigFlags_Handle", ImGuiIO_ConfigFlags_HandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ImGuiIO_BackendFlags_Handle", ImGuiIO_BackendFlags_HandleCbk);
  v8_utils::BindJsToCppAccessors(obj, "ImGuiIO_ConfigFlags", ImGuiIO_ConfigFlags_GetterCbk, ImGuiIO_ConfigFlags_SetterCbk);
  v8_utils::BindJsToCppAccessors(obj, "ImGuiIO_BackendFlags", ImGuiIO_BackendFlags_GetterCbk, ImGuiIO_BackendFlags_SetterCbk);
  v8_utils::BindJsToCppFunction(obj, "MouseDrawCursor", MouseDrawCursorCbk);
  v8_utils::BindJsToCppFunction(obj, "MouseDrawCursorHandle", MouseDrawCursorHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigMacOSXBehaviors", ConfigMacOSXBehaviorsCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigMacOSXBehaviorsHandle", ConfigMacOSXBehaviorsHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigInputTextCursorBlink", ConfigInputTextCursorBlinkCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigInputTextCursorBlinkHandle", ConfigInputTextCursorBlinkHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigWindowsResizeFromEdges", ConfigWindowsResizeFromEdgesCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigWindowsResizeFromEdgesHandle", ConfigWindowsResizeFromEdgesHandleCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigWindowsMoveFromTitleBarOnly", ConfigWindowsMoveFromTitleBarOnlyCbk);
  v8_utils::BindJsToCppFunction(obj, "ConfigWindowsMoveFromTitleBarOnlyHandle", ConfigWindowsMoveFromTitleBarOnlyHandleCbk);
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace