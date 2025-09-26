#include "jsrt.h"
#include "log.h"
#include "application/application.h"

#include <stdio.h>
#include <dirent.h>

#include <iostream>

int main(int argc, char* argv[])
{
#ifdef WITH_V8
  jsrt::Application::run(argc, argv);
#else
  return jsrt::Application::embeddednode().Start(argc, argv);
#endif
}

#ifdef __ANDROID__
void start_node(ANativeActivity* activity, void* savedState, size_t savedStateSize)
{
  LOGI("start node...\n");

  auto& appEnv = jsrt::Application::environment();
  appEnv.mActivity = activity;
  appEnv.mSavedState = savedState;
  appEnv.mSavedStateSize = savedStateSize;

  LOGI("internalDataPath=%s\n", activity->internalDataPath);
  LOGI("externalDataPath=%s\n", activity->externalDataPath);
  LOGI("obbPath=%s\n", activity->obbPath);

  struct dirent *entry = nullptr;
  DIR *dp = nullptr;

  std::string assetsPath = activity->obbPath;
  //std::string assetsPath = "/storage/emulated/0/Android/obb/com.example.jsrt_android/";

  dp = opendir(assetsPath.append("/jsrt_modules").c_str());
  if (dp != nullptr)
  {
    while ((entry = readdir(dp)))
    {
      LOGI("%s\n", entry->d_name);
    }
  }
  closedir(dp);

  int argc = 2;
  std::string scriptPath = activity->obbPath;
  scriptPath.append("/test/test.js");

  //std::string procName = "jsrt";
  //char* argv[] = {(char*)procName.c_str(), (char*)scriptPath.c_str(), nullptr};

  char* adjacentParms = (char*)"jsrt\0/storage/emulated/0/Android/obb/com.example.jsrt_android/test/test_sciter_android.js\0";
  char* argv[] = {(char*)adjacentParms, (char*)(adjacentParms + 5), nullptr};

  LOGI("%s\n", argv[1]);

  FILE * pFile;
  pFile = fopen (scriptPath.c_str(),"r");
  if (pFile != nullptr)
  {
    LOGI("script file is open\n");
    fclose (pFile);
  }

  jsrt::Application::embeddednode().Start(argc, argv);
}

void run_node(ANativeActivity* activity)
{
  LOGI("run node...\n");

  auto& appEnv = jsrt::Application::environment();
  appEnv.mActivity = activity;

  int argc = 2;
  //char* adjacentParms = (char*)"jsrt\0/storage/emulated/0/Android/obb/com.example.sciter_jsrt_android/test/test_sciter_android.js\0";
  char* adjacentParms = (char*)"jsrt\0/storage/emulated/0/Android/obb/com.example.sciter_jsrt_android/projects/Noot/Application/App_android.js\0";
  char* argv[] = {(char*)adjacentParms, (char*)(adjacentParms + 5), nullptr};

  LOGI("%s\n", argv[1]);

  jsrt::Application::embeddednode().Start(argc, argv);
}
#else
void start_node()
{
  int argc = 2;
  //char* adjacentParms = (char*)"jsrt\0/home/nicu/git/javascript/jsrt/test2.js\0";
  char* adjacentParms = (char*)"jsrt\0/storage/emulated/0/Android/obb/com.example.jsrt_android/test/test.js\0";
  char* argv[] = {(char*)adjacentParms, (char*)(adjacentParms + 5), nullptr};
  jsrt::Application::embeddednode().Start(argc, argv);
}
#endif