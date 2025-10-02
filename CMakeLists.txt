cmake_minimum_required(VERSION 4.0.2)

project(jsrt)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if (${ARCH} STREQUAL "ARM64") # android
  set(ANDROID_NODE /home/builder/termux-packages/output/nodejs/src/)
  set(TERMUX_OUTPUT /home/builder/termux-packages/output/)
  set(CMAKE_C_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android-clang)
  set(CMAKE_CXX_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android-clang++)
endif()

set(USE_V8 "TRUE" CACHE BOOL "Option to build using direct v8 libs")
#message(FATAL_ERROR "USE_V8=${USE_V8}")

if (${USE_V8}) # build using direct v8 libraries
  set(CMAKE_CXX_FLAGS "-std=gnu++14 -fPIC -Wno-narrowing -fno-rtti -fvisibility-inlines-hidden")
  set(CMAKE_EXE_LINKER_FLAGS "-pie -Wl,--fatal-warnings -fPIC -Wl,-z,noexecstack -Wl,-z,now -Wl,-z,relro -Wl,-z,defs -Wl,--as-needed -fuse-ld=gold -B${CMAKE_HOME_DIRECTORY}/deps/v8/third_party/binutils/Linux_x64/Release/bin -Wl,--threads -Wl,--thread-count=4 -Wl,--icf=all -m64 -rdynamic -Wl,-rpath-link=. -Wl,--disable-new-dtags -Wl,-O2 -Wl,--gc-sections")
  add_definitions(-DWITH_V8)
elseif (${ARCH} STREQUAL "MACOS_ARM64")
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
elseif (${ARCH} STREQUAL "X86_64") # build using node libraries for x86_64
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
elseif (${ARCH} STREQUAL "ARM64") # android
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
  if (${CMAKE_BUILD_TYPE} STREQUAL "Debug")
    add_definitions(-DHAVE_INSPECTOR)
    add_definitions(-DNODE_WANT_INTERNALS)
    add_definitions(-D_FILE_OFFSET_BITS=64)
  endif()
  #rpath points to <internal storage>/Android/data
  #-Wl,-rpath,/data/user/0/com.termux/files/usr/lib
  set(CMAKE_CXX_FLAGS "-fPIC -fno-rtti -std=gnu++1y")
  #set(CMAKE_SHARED_LINKER_FLAGS -Wl,-rpath,/data/local/tmp)
elseif (${ARCH} STREQUAL "ARM") # build using node libraries for arm
  #set(CMAKE_CXX_STANDARD 14)
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
  set(CMAKE_CXX_FLAGS "-fPIC -fno-rtti -std=gnu++1y")
  set(CMAKE_EXE_LINKER_FLAGS "\
  -pthread \
  -rdynamic \
  -Wl,--whole-archive \
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/libnode.a \
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/tools/v8_gypfiles/libv8_base_without_compiler.a \
  -Wl,--no-whole-archive \
  -Wl,--whole-archive \
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/zlib/libzlib.a \
  -Wl,--no-whole-archive \
  -Wl,--whole-archive \
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/uv/libuv.a \
  -Wl,--no-whole-archive \
  -Wl,-z,noexecstack \
  -Wl,--whole-archive ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/tools/v8_gypfiles/libv8_snapshot.a \
  -Wl,--no-whole-archive \
  -Wl,-z,relro \
  -Wl,-z,now \
  -Wl,--whole-archive,${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/openssl/libopenssl.a \
  -Wl,--no-whole-archive \
	-pthread")
endif()

#include headers directories
#todo: make a list of include paths and feed once include_directories()
if (${USE_V8}) # build using direct v8 libraries
  include_directories(${CMAKE_HOME_DIRECTORY}
  ${CMAKE_HOME_DIRECTORY}/src
  deps/v8
  deps/v8/include
  ${CMAKE_HOME_DIRECTORY}/../v8/utils
  deps/untangled)
elseif (${ARCH} STREQUAL "MACOS_ARM64")  
  include_directories(${CMAKE_HOME_DIRECTORY}
  ${CMAKE_HOME_DIRECTORY}/src
  ${CMAKE_HOME_DIRECTORY}/deps
  ${CMAKE_HOME_DIRECTORY}/deps/node/src
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8/include
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/uv/include
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/googletest/include
  ${CMAKE_HOME_DIRECTORY}/deps/node-addon-api
  ${CMAKE_HOME_DIRECTORY}/src/utils
  ${CMAKE_HOME_DIRECTORY}/deps/actuator
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui/examples)
elseif (${ARCH} STREQUAL "X86_64") # build using node libraries
  include_directories(${CMAKE_HOME_DIRECTORY}
  ${CMAKE_HOME_DIRECTORY}/src
  ${CMAKE_HOME_DIRECTORY}/deps
  ${CMAKE_HOME_DIRECTORY}/deps/node/src
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8/include
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/uv/include
  ${CMAKE_HOME_DIRECTORY}/deps/node-addon-api
  ${CMAKE_HOME_DIRECTORY}/src/utils
  ${CMAKE_HOME_DIRECTORY}/deps/untangled
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui/examples)
elseif (${ARCH} STREQUAL "ARM64") # android
  include_directories(${CMAKE_HOME_DIRECTORY}
  ${CMAKE_HOME_DIRECTORY}/src
  ${CMAKE_HOME_DIRECTORY}/deps/node/src
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/v8/include
  ${CMAKE_HOME_DIRECTORY}/deps/node/deps/uv/include
  ${CMAKE_HOME_DIRECTORY}/src/utils
  ${CMAKE_HOME_DIRECTORY}/deps/untangled
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui
  ${CMAKE_HOME_DIRECTORY}/deps/dear_imgui/examples)
endif()

#add source files
set(SOURCE_FILES
src/jsrt.cpp
src/environment/environment.cpp
src/modules_loader/module_loader.cpp
src/application/application.cpp
src/native_modules/jsrt_core.cpp
src/native_modules/module1.cpp
src/native_modules/module2.cpp
src/native_modules/console.cpp)

if (${ARCH} STREQUAL "ARM64") # android
  set(SOURCE_FILES ${SOURCE_FILES}
  src/native_modules/android_activity.cpp
  src/native_modules/android_logger.cpp)
endif()

if (NOT ${USE_V8})
  add_definitions(-DNODE_WANT_INTERNALS=1)
  set(SOURCE_FILES ${SOURCE_FILES}
    src/node/embeddednode.cpp)
    # src/node/uv_worker_thread.cpp)
endif()

# build executable
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/build/output/bin/${CONFIG}/${CMAKE_BUILD_TYPE})
add_executable(${PROJECT_NAME} ${SOURCE_FILES})

# build library
#set(CMAKE_LIBRARY_OUTPUT_DIRECTORY  ${CMAKE_HOME_DIRECTORY}/build/output/lib/${CONFIG}/${CMAKE_BUILD_TYPE})
#add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

string(TOLOWER ${CMAKE_BUILD_TYPE} lower_build_type)
#todo: make a list of libs and feed once target_link_libraries()
if (${USE_V8}) # build using direct v8 libraries
  target_link_libraries(${PROJECT_NAME}
  ${CMAKE_HOME_DIRECTORY}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_libbase.a
  ${CMAKE_HOME_DIRECTORY}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_libplatform.a
  ${CMAKE_HOME_DIRECTORY}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_monolith.a
  -latomic -ldl -lpthread -lrt -lm)
elseif (${ARCH} STREQUAL "MACOS_ARM64")
  target_link_libraries(${PROJECT_NAME}
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/libnode.137.dylib -ldl -lpthread -lm)
elseif (${ARCH} STREQUAL "X86_64") # build using node libraries
  target_link_libraries(${PROJECT_NAME}
  ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/libnode.so.79
  -ldl -lpthread -lrt -lm ${OPENGL_LIBRARIES} ${GLEW_LIBRARIES})
else (${ARCH} STREQUAL "ARM64") # android
  target_link_libraries(${PROJECT_NAME}
  ${ANDROID_NODE}/out/${CMAKE_BUILD_TYPE}/obj.target/libnode.so
  -L/data/data/com.termux/files/usr/lib -lcares -lm -ldl -llog)
endif()