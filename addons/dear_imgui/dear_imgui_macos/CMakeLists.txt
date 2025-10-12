cmake_minimum_required(VERSION 4.0.2)

project(dear_imgui_macos_addon)

# glfw
find_package(glfw3 REQUIRED)
include_directories(${GLFW_INCLUDE_DIRS})
link_libraries(${GLFW_LIBRARY_DIRS})

# opengl
find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIRS})

#include headers directories
#todo: make a list of include paths and feed once include_directories()
if (${USE_V8}) # build using direct v8 libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps/v8
  ${JSRT_DIR}/deps/v8/include
  ${JSRT_DIR}/../v8/utils
  ${JSRT_DIR}/deps/actuator
  ${JSRT_DIR}/deps/dear_imgui
  ${JSRT_DIR}/deps/dear_imgui/examples)
else() # build using node libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps
  ${JSRT_DIR}/deps/node/src
  ${JSRT_DIR}/deps/node/deps/v8
  ${JSRT_DIR}/deps/node/deps/v8/include
  ${JSRT_DIR}/deps/node/deps/uv/include
  ${JSRT_DIR}/deps/actuator
  ${JSRT_DIR}/deps/dear_imgui
  ${JSRT_DIR}/deps/dear_imgui/backends
  ${JSRT_DIR}/deps/dear_imgui/examples)
endif()

# add source files
set(SOURCE_FILES
src/jsrt_imgui.cpp
src/jsrt_imgui_types.cpp
src/jsrt_imgui_widgets.cpp
src/jsrt_imgui_IO.cpp
src/jsrt_imgui_style.cpp
src/jsrt_imgui_draw.cpp
${JSRT_DIR}/deps/dear_imgui/backends/imgui_impl_glfw.cpp
${JSRT_DIR}/deps/dear_imgui/backends/imgui_impl_opengl2.cpp
${JSRT_DIR}/deps/dear_imgui/imgui.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_tables.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_demo.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_draw.cpp
${JSRT_DIR}/deps/dear_imgui/imgui_widgets.cpp)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/lib/${CMAKE_BUILD_TYPE})

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

#todo: make a list of libs and feed once target_link_libraries()
if (${USE_V8}) # build using direct v8 libraries
# tbd
else() # build using node libraries
  target_link_libraries(${PROJECT_NAME}
  ${JSRT_DIR}/deps/node/out/${CMAKE_BUILD_TYPE}/libnode.137.dylib
  -ldl -lpthread -lm glfw ${OPENGL_LIBRARIES})
endif()
  



