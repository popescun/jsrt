
#pragma once

#include <sciter-x-window.hpp>

namespace jsrt_sciter
{
    class View : public sciter::window
    {
    public:
        explicit View();
        ~View() override;

        bool handle_scripting_call(HELEMENT he, SCRIPTING_METHOD_PARAMS& params) override;
    };
} // jsrt_sciter
