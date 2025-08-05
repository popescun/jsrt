#include "application/application.h"
#include <v8_utils.h>
#include <imgui.h>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{

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
  v8_utils::BindJsToCppFunction(obj, "StyleColorsClassic", StyleColorsClassicCbk);
  v8_utils::BindJsToCppFunction(obj, "StyleColorsDark", StyleColorsDarkCbk);
  v8_utils::BindJsToCppFunction(obj, "StyleColorsLight", StyleColorsLightCbk);
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace