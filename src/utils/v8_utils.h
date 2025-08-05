#pragma once

#include <include/libplatform/libplatform.h>
#include <include/v8.h>

#include <iostream>

using namespace v8;

namespace v8_utils
{

inline std::unique_ptr<v8::Platform> Init()
{
  // Initialize V8.
  //V8::InitializeICUDefaultLocation(argv[0]);
  //V8::InitializeExternalStartupData(argv[0]);
  auto platform = v8::platform::NewDefaultPlatform();
  V8::InitializePlatform(platform.get());
  V8::Initialize();
  return std::move(platform);
}

inline Isolate* CreateIsolate()
{
  Isolate::CreateParams create_params;
  create_params.array_buffer_allocator = ArrayBuffer::Allocator::NewDefaultAllocator();
  return Isolate::New(create_params);
}

#define CPP_GETTER_ACCESSOR(name) void name(Local<String> property, const PropertyCallbackInfo<Value>& info)
#define CPP_SETTER_ACCESSOR(name) void name(Local<String> property, Local<Value> value, const PropertyCallbackInfo<void>& info)
#define CPP_GETTER_ACCESSOR_NAME(name) void name(Local<Name> property, const PropertyCallbackInfo<Value>& info)
#define CPP_SETTER_ACCESSOR_NAME(name) void name(Local<Name> property, Local<Value> value, const PropertyCallbackInfo<void>& info)
#define CPP_CALLBACK(name) void name(const FunctionCallbackInfo<Value>& args)

// binders for ObjectTemplate
template<typename CallbackT>
void BindJsToCppFunction(Isolate* isolate,
                         const Handle<ObjectTemplate>& obj,
                         const std::string& function,
                         CallbackT callback)
{
  obj->Set(String::NewFromUtf8(isolate, function.c_str()), FunctionTemplate::New(isolate, callback));
}

template<typename GetterT, typename SetterT>
void BindJsToCppAccessors(Isolate* isolate,
                          const Handle<ObjectTemplate>& obj,
                          const std::string& JsVariable,
                          GetterT getter,
                          SetterT setter)
{
  obj->SetAccessor(String::NewFromUtf8(isolate, JsVariable.c_str()), getter, setter);
}

// binders for Object
template<typename CallbackT>
void BindJsToCppFunction(const Handle<Object>& obj,
                         const std::string& function,
                         CallbackT callback)
{
  auto isol = obj->GetIsolate();
  auto curCtx = isol->GetCurrentContext();
  obj->Set(curCtx, String::NewFromUtf8(isol, function.c_str()).ToLocalChecked(), Function::New(curCtx, callback).ToLocalChecked());
}

template<typename GetterT, typename SetterT>
void BindJsToCppAccessors(const Handle<Object>& obj,
                          const std::string& JsVariable,
                          GetterT getter,
                          SetterT setter)
{
  auto isol = obj->GetIsolate();
  auto curCtx = isol->GetCurrentContext();
  obj->SetAccessor(curCtx, Local<Name>(String::NewFromUtf8(isol, JsVariable.c_str()).ToLocalChecked()), getter, setter);
}

inline std::string LoadJSFile(std::string path)
{
  std::string str;
  std::ifstream infile;
  infile.open(path);
  while(infile.good())
  {
    std::string line;
    getline(infile, line);
    str.append(line + '\n');
  }
  infile.close();
  return str;
}

inline void ExecuteScript(const Handle<Context>& context,
                          const std::string& jsfile)
{
  // Create a string containing the JavaScript source code.
  auto mayBeLocalSource = String::NewFromUtf8(context->GetIsolate(), LoadJSFile(jsfile).c_str(), NewStringType::kNormal);
  Local<String> localSource;
  if (mayBeLocalSource.ToLocal(&localSource))
  {
    // Compile the source code.
    auto mayBeLocalscript = Script::Compile(context, localSource);
    Local<Script> localScript;
    if (mayBeLocalscript.ToLocal(&localScript))
    {
      // Run the script to get the result.
      auto mayBeLocalResult = localScript->Run(context);
      Local<Value> localResult;
      if (mayBeLocalResult.ToLocal(&localResult))
      {
        // Convert the result to an UTF8 string and print it.
        String::Utf8Value utf8Val(context->GetIsolate(), localResult);
        //std::cout << "ExecuteScript result=" << *utf8Val << std::endl;
      }
    }
  }
}

inline Handle<Value> CallJSFunction(const Handle<Object>& obj,
                                    const std::string& funcName,
                                    Handle<Value> args[],
                                    unsigned int argCount)
{
  auto isol = obj->GetIsolate();
  auto curCtx = isol->GetCurrentContext();
  Handle<Value> value = obj->Get(curCtx, String::NewFromUtf8(isol, funcName.c_str()).ToLocalChecked()).ToLocalChecked();
  Handle<Function> func = Handle<Function>::Cast(value);
  auto maybeLocalResult = func->Call(curCtx, obj, argCount, args);
  return maybeLocalResult.ToLocalChecked();
}

// Extracts a C string from a V8 Utf8Value.
inline const char* ToCString(const String::Utf8Value& value)
{
  return *value ? *value : "<string conversion failed>";
}

inline bool GetObjectProperty(const Handle<Object>& obj,
                              const std::string& propertyName,
                              Local<Value>& propertyVal)
{
  auto isol = obj->GetIsolate();
  auto curCtx = isol->GetCurrentContext();
  auto mayBeLocal = obj->Get(curCtx, String::NewFromUtf8(isol, propertyName.c_str()).ToLocalChecked());
  return mayBeLocal.ToLocal(&propertyVal);
}
}

