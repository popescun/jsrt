cmake_minimum_required(VERSION 3.5)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(uminimal)

find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK3 REQUIRED gtk+-3.0)

# Setup CMake to use GTK+, tell the compiler where to look for headers
# and to the linker where to look for libraries
INCLUDE_DIRECTORIES(${GTK3_INCLUDE_DIRS})
LINK_DIRECTORIES(${GTK3_LIBRARY_DIRS})


set(REPO_DIR ${CMAKE_HOME_DIRECTORY}/../../deps/sciter/)

include_directories(${REPO_DIR}
  ${REPO_DIR}/include)

#add source files
set(SOURCE_FILES
${REPO_DIR}/include/sciter-gtk-main.cpp
${REPO_DIR}/demos/uminimal/uminimal.cpp)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/bin/${CMAKE_BUILD_TYPE})

add_executable(${PROJECT_NAME} ${SOURCE_FILES})

target_link_libraries(${PROJECT_NAME}
${REPO_DIR}/bin.lnx/x64/libsciter-gtk.so ${GTK3_LIBRARIES} -ldl -lpthread)
