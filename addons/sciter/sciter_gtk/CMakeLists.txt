project(sciter_gtk_addon)

# gtk
find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK3 REQUIRED gtk+-3.0)

# Setup CMake to use GTK+, tell the compiler where to look for headers
# and to the linker where to look for libraries
include_directories(${GTK3_INCLUDE_DIRS})
link_directories(${GTK3_LIBRARY_DIRS})

#include headers directories
#todo: make a list of include paths and feed once include_directories()
if (${USE_V8}) # build using direct v8 libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps/v8
  ${JSRT_DIR}/deps/v8/include
  ${JSRT_DIR}/../v8/utils
  ${JSRT_DIR}/deps/untangled
  ${JSRT_DIR}/deps/sciter
  ${JSRT_DIR}/deps/sciter/include
  ${JSRT_DIR}/deps/sciter/demos/uminimal
  src)
else() # build using node libraries
  include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/deps/node/src
  ${JSRT_DIR}/deps/node/deps/v8
  ${JSRT_DIR}/deps/node/deps/v8/include
  ${JSRT_DIR}/deps/node/deps/uv/include
  ${JSRT_DIR}/deps/untangled
  ${JSRT_DIR}/deps/sciter
  ${JSRT_DIR}/deps/sciter/include
  ${JSRT_DIR}/deps/sciter/demos/uminimal
  ../shared
  src)
endif()

#add source files
set(SOURCE_FILES
  ${JSRT_DIR}/deps/sciter/include/sciter-gtk-main.cpp
  src/jsrt_sciter_gtk.cpp
  src/uv_hook.cpp
  ../shared/jsrt_sciter_value.cpp)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/build/output/lib/${CONFIG}/${CMAKE_BUILD_TYPE})

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
  -ldl -lpthread -lrt -lm ${GTK3_LIBRARIES})
endif()

