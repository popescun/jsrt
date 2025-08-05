#pragma once

#ifdef __ANDROID__
#include <android/log.h>
#include <android/native_activity.h>

#define LOGI(...) ((void)__android_log_print(ANDROID_LOG_INFO, "jsrt", __VA_ARGS__))
#define LOGE(...) ((void)__android_log_print(ANDROID_LOG_ERROR, "jsrt", __VA_ARGS__))

// For debug builds, always enable the debug traces in this library
#ifndef NDEBUG
#  define LOGV(...)  ((void)__android_log_print(ANDROID_LOG_VERBOSE, "jsrt", __VA_ARGS__))
#else
#  define LOGV(...)  ((void)0)
#endif
#endif