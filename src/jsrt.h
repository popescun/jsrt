#pragma once

#ifdef __ANDROID__
#include <android/native_activity.h>
extern "C" void start_node(ANativeActivity* activity, void* savedState, size_t savedStateSize);
extern "C" void run_node(ANativeActivity* activity);
#else
extern "C" void start_node();
#endif
