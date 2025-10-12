
#pragma once

#include <v8.h>
#include <sciter-x.h>
#include <vector>

namespace jsrt_sciter
{
sciter::value jsToSciterValue(v8::Isolate* isolate, const v8::Local<v8::Value>& val);
std::vector<sciter::value> jsToSciterValues(const v8::FunctionCallbackInfo<v8::Value>& args, uint8_t startIndex);
v8::Local<v8::Value> sciterToJsValue(v8::Isolate* isolate, sciter::value val);
std::vector<v8::Local<v8::Value>> sciterToJsValues(v8::Isolate* isolate, aux::slice<sciter::value> values, uint8_t startIndex);
} // jsrt_sciter
