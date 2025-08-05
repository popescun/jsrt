project(sciter_glfw_addon)

add_definitions(-DWINDOWLESS)

#message(FATAL_ERROR "CMAKE_CURRENT_SOURCE_DIR=${CMAKE_CURRENT_SOURCE_DIR}")

# glfw
find_package(glfw3 REQUIRED)
include_directories(${GLFW_INCLUDE_DIRS})
link_libraries(${GLFW_LIBRARY_DIRS})

include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/src/utils
  ${JSRT_DIR}/deps/node/src
  ${JSRT_DIR}/deps/node/deps/v8
  ${JSRT_DIR}/deps/node/deps/v8/include
  ${JSRT_DIR}/deps/node/deps/uv/include
  ${JSRT_DIR}/deps/untangled
  ${JSRT_DIR}/deps/sciter
  ${JSRT_DIR}/deps/sciter/include
  ${JSRT_DIR}/deps/sciter/demos.lite/glfw/deps
  ${JSRT_DIR}/deps/sciter/demos.lite/glfw/deps/include
  ../shared
  src)


#add source files
set(SOURCE_FILES
  src/jsrt_sciter_glfw.cpp
  ../shared/jsrt_sciter_value.cpp
  ${JSRT_DIR}/deps/sciter/demos.lite/glfw/deps/glad.c)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/build/output/lib/${CONFIG}/${CMAKE_BUILD_TYPE})

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

target_link_libraries(${PROJECT_NAME} ${JSRT_DIR}/deps/sciter/bin.lnx/x64lite/libsciter.so -ldl glfw)




