#pragma once

namespace node
{
class MultiIsolatePlatform;
class Environment;
}

namespace jsrt
{
  class Environment;
}

namespace v8
{
  class Isolate;
}

class uv_loop_s;

namespace jsrt
{
class EmbeddedNode
{
public:
  void Start(int argc, char* argv[]);

private:
  bool IterateEventLoop();

private:
  node::MultiIsolatePlatform* mMultiIsolatePlatform;
  uv_loop_s* mEventLoop;
  node::Environment* mEnv;
  int exec_argc;
};
} // jsrt namespace