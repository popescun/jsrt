#pragma once

#include <string>
#include <functional>
#include <include/v8.h>
#include <actuator/actuator.h>
#include <map>

namespace jsrt
{
class Module
{
public:
  using actionT = std::function<void(v8::Handle<v8::Object>)>;
  Module();
  ~Module();
  void RegisterBindAction(std::string name, actionT* action);
  void Bind(std::string name, v8::Handle<v8::Object> obj);
  void BindCoreObj();
  bool IsInternalModule(std::string name);

private:
  untangle::actuator<actionT> actuatorBind;
};
} // jsrt namespace
