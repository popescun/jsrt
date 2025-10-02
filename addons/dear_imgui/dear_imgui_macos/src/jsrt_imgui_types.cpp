#include <environment/environment.h>
#include <utils/v8_utils.h>

#include <iostream>

namespace jsrt
{
namespace modules
{
namespace dear_imgui
{

constexpr char NAME[] = "dear_imgui_types";

void BindTypes(v8::Handle<v8::Object> obj)
{
  std::cout << NAME << " Bind as addon..." << std::endl;
}
} // dear_imgui namespace
} // modules namespace
} // jsrt namespace