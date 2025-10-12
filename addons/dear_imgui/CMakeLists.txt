cmake_minimum_required(VERSION 4.0.2)

project(dear_imgui_addon)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(JSRT_DIR ${CMAKE_HOME_DIRECTORY}/../../)
# message(FATAL_ERROR "JSRT_DIR=${JSRT_DIR}")

set(USE_V8 "FALSE" CACHE BOOL "Option to build using direct v8 libs")

string(TOLOWER ${CMAKE_BUILD_TYPE} lower_build_type)

#set(ARCH "MACOS_ARM64")

if (${USE_V8}) # build using direct v8 libraries
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
  #set(CMAKE_CXX_FLAGS "-std=gnu++14 -fPIC -Wno-narrowing -fno-rtti -fvisibility-inlines-hidden")
  set(CMAKE_CXX_FLAGS "-fPIC -fno-rtti -std=gnu++1y")
  set(CMAKE_EXE_LINKER_FLAGS "-pie -Wl,--fatal-warnings -fPIC -Wl,-z,noexecstack -Wl,-z,now -Wl,-z,relro -Wl,-z,defs -Wl,--as-needed -fuse-ld=gold -B${JSRT_DIR}/deps/v8/third_party/binutils/Linux_x64/Release/bin -Wl,--threads -Wl,--thread-count=4 -Wl,--icf=all -m64 -rdynamic -Wl,-rpath-link=. -Wl,--disable-new-dtags -Wl,-O2 -Wl,--gc-sections")
  add_definitions(-DWITH_V8)
elseif (${ARCH} STREQUAL "X86_64") # build using node libraries for x86_64
  #set(CMAKE_CXX_STANDARD_REQUIRED ON)
  #set(CMAKE_CXX_FLAGS "-fPIC -fno-rtti -std=gnu++1y")
elseif (${ARCH} STREQUAL "ARM") # build using node libraries for arm
  #set(CMAKE_CXX_STANDARD 14)
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
  set(CMAKE_CXX_FLAGS "-fPIC -fno-rtti -std=gnu++1y")
  set(CMAKE_EXE_LINKER_FLAGS "\
  -pthread \
  -rdynamic \
  -Wl,--whole-archive,${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/libnode.a \
  -Wl,--no-whole-archive \
  -Wl,--whole-archive,${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/zlib/libzlib.a \
  -Wl,--no-whole-archive \
  -Wl,--whole-archive,${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/uv/libuv.a \
  -Wl,--no-whole-archive \
  -Wl,-z,noexecstack \
  -Wl,--whole-archive ${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/v8/gypfiles/libv8_base.a \
  -Wl,--no-whole-archive \
  -Wl,-z,relro \
  -Wl,-z,now \
  -Wl,--whole-archive,${CMAKE_HOME_DIRECTORY}/deps/node/out/${CMAKE_BUILD_TYPE}/obj.target/deps/openssl/libopenssl.a \
  -Wl,--no-whole-archive \
  -pthread")
endif()

#todo: add other platforms
if (${ARCH} STREQUAL "MACOS_ARM64")
  add_subdirectory(dear_imgui_macos)
endif()



