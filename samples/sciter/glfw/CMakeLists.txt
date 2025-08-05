cmake_minimum_required(VERSION 3.5)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(basic_glfw)

add_definitions(-DWINDOWLESS)

# glfw
find_package(glfw3 REQUIRED)
include_directories(${GLFW_INCLUDE_DIRS})
link_libraries(${GLFW_LIBRARY_DIRS})

set(REPO_DIR ${CMAKE_HOME_DIRECTORY}/../../../deps/sciter/)

include_directories(${REPO_DIR}
  ${REPO_DIR}/include
  ${REPO_DIR}/demos.lite/glfw/deps
  ${REPO_DIR}/demos.lite/sciter-glfw-opengl)

#add source files
set(SOURCE_FILES
${REPO_DIR}/demos.lite/glfw/deps/glad.c
basic.cpp)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/bin/${CMAKE_BUILD_TYPE})

add_executable(${PROJECT_NAME} ${SOURCE_FILES})

target_link_libraries(${PROJECT_NAME} ${REPO_DIR}/bin.lnx/x64lite/libsciter.so glfw -ldl)
