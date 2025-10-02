#include "application/application.h"
#include <v8_utils.h>
#include <imgui.h>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{
CPP_CALLBACK(TextCbk)
{
  auto isol = args.GetIsolate();
  auto text = std::string(*v8::String::Utf8Value(isol, args[0]));
  ImGui::Text("%s", text.c_str());
}

CPP_CALLBACK(TextColoredCbk)
{
  static ImVec4 textColor;
  auto isol = args.GetIsolate();
  auto ctx = isol->GetCurrentContext();
  auto vec4Obj = Handle<Object>::Cast(args[0]);
  textColor.x = vec4Obj->Get(ctx, String::NewFromUtf8(isol, "x").ToLocalChecked()).ToLocalChecked()->NumberValue(ctx).ToChecked();
  textColor.y = vec4Obj->Get(ctx, String::NewFromUtf8(isol, "y").ToLocalChecked()).ToLocalChecked()->NumberValue(ctx).ToChecked();
  textColor.z = vec4Obj->Get(ctx, String::NewFromUtf8(isol, "z").ToLocalChecked()).ToLocalChecked()->NumberValue(ctx).ToChecked();
  textColor.w = vec4Obj->Get(ctx, String::NewFromUtf8(isol, "w").ToLocalChecked()).ToLocalChecked()->NumberValue(ctx).ToChecked();
  auto text = std::string(*v8::String::Utf8Value(isol, args[1]));
  ImGui::TextColored(textColor, "%s", text.c_str());
}

CPP_CALLBACK(BulletTextCbk)
{
  auto isol = args.GetIsolate();
  auto text = std::string(*v8::String::Utf8Value(isol, args[0]));
  ImGui::BulletText("%s", text.c_str());
}

CPP_CALLBACK(ButtonCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  args.GetReturnValue().Set(ImGui::Button(label.c_str()));
}

CPP_CALLBACK(SameLineCbk)
{
  ImGui::SameLine();
}

CPP_CALLBACK(BeginMenuBarCbk)
{
  args.GetReturnValue().Set(ImGui::BeginMenuBar());
}

CPP_CALLBACK(EndMenuBarCbk)
{
  ImGui::EndMenuBar();
}

CPP_CALLBACK(BeginMenuCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  args.GetReturnValue().Set(ImGui::BeginMenu(label.c_str()));
}

CPP_CALLBACK(EndMenuCbk)
{
  ImGui::EndMenu();
}

CPP_CALLBACK(MenuItemCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  static bool showSomething = false;
  ImGui::MenuItem(label.c_str(), nullptr, &showSomething);
}

CPP_CALLBACK(SpacingCbk)
{
  ImGui::Spacing();
}

CPP_CALLBACK(CollapsingHeaderCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  args.GetReturnValue().Set(ImGui::CollapsingHeader(label.c_str()));
}

CPP_CALLBACK(TreeNodeCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  args.GetReturnValue().Set(ImGui::TreeNode(label.c_str()));
}

CPP_CALLBACK(TreePopCbk)
{
  ImGui::TreePop();
}

CPP_CALLBACK(SeparatorCbk)
{
  ImGui::Separator();
}

CPP_CALLBACK(CheckboxFlagsCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  //auto flagsHandle = Uint32::Cast(*args[1])->Value();
  auto flagsHandle = BigInt::Cast(*args[1])->Uint64Value();
  auto flagsPtr = reinterpret_cast<unsigned int*>(flagsHandle);
  auto flagVal = Uint32::Cast(*args[2])->Value();
  args.GetReturnValue().Set(ImGui::CheckboxFlags(label.c_str(), flagsPtr, flagVal));
}

CPP_CALLBACK(CheckboxCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  //auto vHandle = Uint32::Cast(*args[1])->Value();
  auto vHandle = BigInt::Cast(*args[1])->Uint64Value();
  auto vPtr = reinterpret_cast<bool*>(vHandle);
  args.GetReturnValue().Set(ImGui::Checkbox(label.c_str(), vPtr));
}

CPP_CALLBACK(TextDisabledCbk)
{
  auto isol = args.GetIsolate();
  auto text = std::string(*v8::String::Utf8Value(isol, args[0]));
  ImGui::TextDisabled("%s", text.c_str());
}

CPP_CALLBACK(TextUnformattedCbk)
{
  auto isol = args.GetIsolate();
  auto text = std::string(*v8::String::Utf8Value(isol, args[0]));
  ImGui::TextUnformatted(text.c_str());
}

CPP_CALLBACK(ComboCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  //auto currentItemHandle = Uint32::Cast(*args[1])->Value();
  auto currentItemHandle = BigInt::Cast(*args[1])->Uint64Value();
  auto currentItemPtr = reinterpret_cast<int*>(currentItemHandle);
  auto items = std::string(*v8::String::Utf8Value(isol, args[2]));
  for (auto& ch : items)
  {
    if (ch == '|')
    {
      ch = '\0';
    }
  }
  args.GetReturnValue().Set(ImGui::Combo(label.c_str(), currentItemPtr, items.c_str()));
}

CPP_CALLBACK(BeginComboCbk)
{
  auto isol = args.GetIsolate();
  auto label = std::string(*v8::String::Utf8Value(isol, args[0]));
  auto preview_value = std::string(*v8::String::Utf8Value(isol, args[1]));
  args.GetReturnValue().Set(ImGui::BeginCombo(label.c_str(), preview_value.c_str()));
}

CPP_CALLBACK(EndComboCbk)
{
  ImGui::EndCombo();
}

void BindWidgets(Handle<Object> obj)
{
  v8_utils::BindJsToCppFunction(obj, "Text", TextCbk);
  v8_utils::BindJsToCppFunction(obj, "TextColored", TextColoredCbk);
  v8_utils::BindJsToCppFunction(obj, "BulletText", BulletTextCbk);
  v8_utils::BindJsToCppFunction(obj, "Button", ButtonCbk);
  v8_utils::BindJsToCppFunction(obj, "SameLine", SameLineCbk);
  v8_utils::BindJsToCppFunction(obj, "BeginMenuBar", BeginMenuBarCbk);
  v8_utils::BindJsToCppFunction(obj, "EndMenuBar", EndMenuBarCbk);
  v8_utils::BindJsToCppFunction(obj, "BeginMenu", BeginMenuCbk);
  v8_utils::BindJsToCppFunction(obj, "EndMenu", EndMenuCbk);
  v8_utils::BindJsToCppFunction(obj, "MenuItem", MenuItemCbk);
  v8_utils::BindJsToCppFunction(obj, "Spacing", SpacingCbk);
  v8_utils::BindJsToCppFunction(obj, "CollapsingHeader", CollapsingHeaderCbk);
  v8_utils::BindJsToCppFunction(obj, "TreeNode", TreeNodeCbk);
  v8_utils::BindJsToCppFunction(obj, "TreePop", TreePopCbk);
  v8_utils::BindJsToCppFunction(obj, "Separator", SeparatorCbk);
  v8_utils::BindJsToCppFunction(obj, "CheckboxFlags", CheckboxFlagsCbk);
  v8_utils::BindJsToCppFunction(obj, "Checkbox", CheckboxCbk);
  v8_utils::BindJsToCppFunction(obj, "TextDisabled", TextDisabledCbk);
  v8_utils::BindJsToCppFunction(obj, "TextUnformatted", TextUnformattedCbk);
  v8_utils::BindJsToCppFunction(obj, "Combo", ComboCbk);
  v8_utils::BindJsToCppFunction(obj, "BeginCombo", BeginComboCbk);
  v8_utils::BindJsToCppFunction(obj, "EndCombo", EndComboCbk);
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace