cmake_minimum_required(VERSION 3.5)

project(dear_imgui_addon)

set(JSRT_DIR ${CMAKE_HOME_DIRECTORY}/../../)

set(USE_V8 "TRUE" CACHE BOOL "Option to build using direct v8 libs")
#message(FATAL_ERROR "USE_V8=${USE_V8}")

string(TOLOWER ${CMAKE_BUILD_TYPE} lower_build_type)

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

cmake_policy(SET CMP0072 OLD)

# glfw
find_package(glfw3 REQUIRED)
include_directories(${GLFW_INCLUDE_DIRS})
link_libraries(${GLFW_LIBRARY_DIRS})

# opengl
find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIRS})

# glew
find_package(GLEW REQUIRED)
include_directories(${GLEW_INCLUDE_DIRS})

#include headers directories
#todo: make a list of include paths and feed once include_directories()
if (${USE_V8}) # build using direct v8 libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps/v8
  ${JSRT_DIR}/deps/v8/include
  ${JSRT_DIR}/../v8/utils
  ${JSRT_DIR}/deps/untangled
  ${JSRT_DIR}/deps/dear_imgui
  ${JSRT_DIR}/deps/dear_imgui/examples)
else() # build using node libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps/node/src
  ${JSRT_DIR}/deps/node/deps/v8
  ${JSRT_DIR}/deps/node/deps/v8/include
  ${JSRT_DIR}/deps/node/deps/uv/include
  ${JSRT_DIR}/../v8/utils
  ${JSRT_DIR}/deps/untangled
  ${JSRT_DIR}/deps/dear_imgui
  ${JSRT_DIR}/deps/dear_imgui/examples)
endif()

#add source files
set(SOURCE_FILES
src/jsrt_imgui.cpp
src/jsrt_imgui_types.cpp
src/jsrt_imgui_widgets.cpp
src/jsrt_imgui_IO.cpp
src/jsrt_imgui_style.cpp
src/jsrt_imgui_draw.cpp
${JSRT_DIR}/deps/dear_imgui/examples/imgui_impl_glfw.cpp
${JSRT_DIR}/deps/dear_imgui/examples/imgui_impl_opengl2.cpp
${JSRT_DIR}/deps/dear_imgui/imgui.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_demo.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_draw.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_widgets.cpp)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/lib/${CMAKE_BUILD_TYPE})

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

#todo: make a list of libs and feed once target_link_libraries()
if (${USE_V8}) # build using direct v8 libraries
  target_link_libraries(${PROJECT_NAME}
  ${JSRT_DIR}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_libbase.a
  ${JSRT_DIR}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_libplatform.a
  ${JSRT_DIR}/deps/v8/out.gn/x64.${lower_build_type}/obj/libv8_monolith.a
  -ldl -lpthread -lrt -lm glfw ${OPENGL_LIBRARIES} ${GLEW_LIBRARIES})
else() # build using node libraries
  target_link_libraries(${PROJECT_NAME}
  -ldl -lpthread -lrt -lm glfw ${OPENGL_LIBRARIES} ${GLEW_LIBRARIES})
endif()



