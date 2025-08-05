#include "application/application.h"
#include "log.h"
#include <v8_utils.h>
#include <dlfcn.h>

namespace jsrt
{
static char JS_NATIVE_MODULES_PATH[] = "/jsrt_modules/native/";
static char JS_MODULES_PATH[] = "/jsrt_modules/js/";

bool file_exists(std::string file)
{
  std::ifstream f(file);
  return static_cast<bool>(f);
}

std::string module_name(const std::string& path)
{
  auto pos = path.rfind('/');
  return pos == std::string::npos ? path : path.substr(pos + 1);
}
// callbacks
CPP_CALLBACK (Include)
{
  auto isol = args.GetIsolate();
  auto curCtx = isol->GetCurrentContext();
  auto globalObj = curCtx->Global();
  HandleScope scope(isol);
  Context::Scope ctxScope(isol->GetCurrentContext());

  // module name
  auto arg = args[0];
  auto includeName = std::string(*String::Utf8Value(isol, arg));
  std::cout << "include " << includeName << std::endl;

  auto moduleName = module_name(includeName);
  auto filePath = Application::environment().mModulesDirectory + std::string(JS_NATIVE_MODULES_PATH).append(includeName).append(".js");
  //std::cout << "filePath=" << filePath << std::endl;
  if (file_exists(filePath)) // try as native module
  {
    Application::environment().RunScript(filePath);

    auto bindingObj = Object::New(isol);

    if (Application::module().IsInternalModule(moduleName)) // internal module
    {
      Application::module().Bind(moduleName, bindingObj);
    }
    else // maybe addon module
    {
      Local<Value> propertyVal;
      //void (*addonBind)(Handle<Object>, Local<Context>);
      void (*addonBind)(Handle<Object>, Environment*);
      addonBind = nullptr;
      if (v8_utils::GetObjectProperty(globalObj, "exports", propertyVal))
      {
        if (propertyVal->IsNull())
        {
          std::cout << "exports value is null" << std::endl;
          return;
        }

        if (propertyVal->IsUndefined())
        {
          std::cout << "exports value is undefined" << std::endl;
          return;
        }

        auto exportsObj = propertyVal->ToObject(curCtx).ToLocalChecked();
        if (v8_utils::GetObjectProperty(exportsObj, "addonPath", propertyVal))
        {
          String::Utf8Value addonPath{isol, propertyVal};
          std::string fullAddonPath = Application::environment().mModulesDirectory + "/" + *addonPath;
#ifdef __ANDROID__
          fullAddonPath = *addonPath;
#endif
          std::cout << "addonPath=" << fullAddonPath << std::endl;
#ifdef __ANDROID__
  LOGI("addonPath=%s", fullAddonPath.c_str());
#endif
          if (addonPath.length() > 0)
          {
            void* hLibrary = dlopen(fullAddonPath.c_str(), RTLD_NOW | RTLD_GLOBAL);
            if (!hLibrary)
            {
              std::cout << "module_loader dlopen error:" << dlerror() << std::endl;
#ifdef __ANDROID__
  LOGI("module_loader dlopen error:%s", dlerror());
#endif
            }
            else
            {
              dlerror();
              *(void **) (&addonBind) = dlsym(hLibrary, "Bind");
              char *error;
              if ((error = dlerror()) != NULL)
              {
                std::cout << "module_loader dlsym error:" << error << std::endl;
              }
              else
              {
                //addonBind(bindingObj, Application::environment().mGlobalCtx);
                addonBind(bindingObj, &Application::environment());
              }
            }
          }
        }
      }
    }
    Handle<Value> argList[1];
    argList[0] = bindingObj;
    auto localVal = v8_utils::CallJSFunction(globalObj, "onincluded", argList, 1);
    args.GetReturnValue().Set(localVal);
    Local<Object> localObj;
    if (localVal->ToObject(curCtx).ToLocal(&localObj))
    {
      // set a global object named by the module name
      // todo: do this only for the includes in the start script run by node.js:
      // node.js assign variables to the local module, so they cannot be accessed through the global object (e.g from sciter script)
      // todo: investigate if necessary any more as node has a "global" object where we can keep module object references?
      curCtx->Global()->Set(curCtx, String::NewFromUtf8(isol, moduleName.c_str()).ToLocalChecked(), localObj);
    }
  }
  else // JS land module
  {
    // try to load as a common JS module
    filePath = Application::environment().mModulesDirectory + std::string(JS_MODULES_PATH).append(includeName).append(".js");
    if (!file_exists(filePath))
    {
      // try to load relative to the init module directory
      filePath = std::string(Application::environment().mInitModuleDirectory).append(includeName).append(".js");
      if (!file_exists(filePath))
      {
        throw std::runtime_error(moduleName.append(".js") + " could not be found!");
      }
    }

    Application::environment().RunScript(filePath);

    auto result = v8_utils::CallJSFunction(globalObj, "onincluded", nullptr, 0);
    args.GetReturnValue().Set(result);
  }
}

// public interface
void Module::RegisterBindAction(std::string name, actionT* action)
{
  if (actuatorBind.is_connected())
  {
    actuatorBind.add(name, action);
  }
  else
  {
    actuatorBind = untangle::connect(std::make_pair(name, action));
  }
}

void  Module::Bind(std::string name, v8::Handle<v8::Object> obj)
{
  // todo: check obj is valid
  actuatorBind.invokeAction(name, obj);
}

void Module::BindCoreObj()
{
  Module::Bind("jsrt_core", Application::environment().mGlobalCoreObj);
}

bool Module::IsInternalModule(std::string name)
{
  return actuatorBind.has_action(name);
}

Module::Module()
{
  V8_CONTEXT_SCOPE
  v8_utils::BindJsToCppFunction(Application::environment().mGlobalObj, "include", Include);
}

Module::~Module() = default;
}
