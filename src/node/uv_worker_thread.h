#include <napi.h>

#include <node/src/js_native_api_v8.h>

namespace jsrt
{
class UvAsyncWorker: public Napi::AsyncWorker
{
public:
  UvAsyncWorker(v8::Local<v8::Context> context, const Napi::Function& callback);

  // Napi::AsyncWorker
  void Execute() override {}
  void OnOK() override;

private:
  napi_env__ mEnv;
  Napi::Function mCallback;
};
} // jsrt namespace