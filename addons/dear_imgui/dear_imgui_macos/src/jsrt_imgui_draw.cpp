#include <environment/environment.h>
#include <utils/v8_utils.h>
#include <imgui.h>

#include <iostream>

namespace jsrt::modules::dear_imgui
{

using namespace v8;

constexpr char NAME[] = "dear_imgui_draw";

CPP_CALLBACK(StyleColorsClassicCbk)
{
  ImGui::StyleColorsClassic();
}

CPP_CALLBACK(StyleColorsDarkCbk)
{
  ImGui::StyleColorsDark();
}

CPP_CALLBACK(StyleColorsLightCbk)
{
  ImGui::StyleColorsLight();
}

void BindDraw(Handle<Object> obj)
{
  std::cout << NAME << " Bind as addon..." << std::endl;

  v8_utils::BindJsToCppFunction(obj, "StyleColorsClassic", StyleColorsClassicCbk);
  v8_utils::BindJsToCppFunction(obj, "StyleColorsDark", StyleColorsDarkCbk);
  v8_utils::BindJsToCppFunction(obj, "StyleColorsLight", StyleColorsLightCbk);
}
} // dear_imgui namespace
// modules namespace
// jsrt namespace