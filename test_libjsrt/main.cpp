#include <iostream>
#include <dlfcn.h>
#include <jsrt.h>

int main()
{
  /*void* hLibrary = dlopen("libjsrt.so", RTLD_NOW | RTLD_GLOBAL);
  if (!hLibrary)
  {
      std::cout <<  dlerror() << std::endl;
  }*/
  std::cout << "start node..." << std::endl;
  start_node();
  return 0;
}