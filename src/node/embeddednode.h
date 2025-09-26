#pragma once

#include <vector>

namespace node {
class CommonEnvironmentSetup;
}

namespace jsrt {
class EmbeddedNode {
public:
  int Start(int argc, char *argv[]);

private:
  int RunNodeInstance(const node::CommonEnvironmentSetup *setup,
                      const std::vector<std::string> &args);
};
} // namespace jsrt