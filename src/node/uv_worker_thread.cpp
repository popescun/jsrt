#include "uv_worker_thread.h"

void cbk(const Napi::CallbackInfo& args)
{
  //...
}

namespace jsrt
{
UvAsyncWorker::UvAsyncWorker(v8::Local<v8::Context> context, const Napi::Function& callback) :
  mEnv(context),
   Napi::AsyncWorker(callback)
{
  mCallback = Napi::Function::New(&mEnv, cbk);
}

void UvAsyncWorker::OnOK()
{
  Callback().Call({});
}
} // jsrt namespace
