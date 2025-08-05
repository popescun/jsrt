#pragma once

#include <sciter-x.h>

namespace jsrt_sciter
{
class dom_event_handler: public sciter::event_handler
{
public:
  // event_handler
  bool handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params) override;
};
}