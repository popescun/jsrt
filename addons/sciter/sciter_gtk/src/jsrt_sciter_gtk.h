
#pragma once

#include <sciter-x.h>
#include <sciter-x-window.hpp>

namespace jsrt_sciter
{
// view
class View : public sciter::window
{
public:
  explicit View();
  ~View();

  bool handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params) override;
};
} // jsrt_sciter
