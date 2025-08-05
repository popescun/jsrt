cmake_minimum_required(VERSION 3.5)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if (${ARCH} STREQUAL "ARM64") # android
  set(TERMUX_OUTPUT /home/builder/termux-packages/output/)
  set(CMAKE_C_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android24-clang)
  set(CMAKE_CXX_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android24-clang++)
endif()

set(CMAKE_EXE_LINKER_FLAGS -Wl,-rpath,/data/local/tmp)

project(test_libjsrt)

#include headers directories
include_directories(../ ${CMAKE_HOME_DIRECTORY}/../src)

#add source files
set(SOURCE_FILES main.cpp)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/bin)

add_executable(${PROJECT_NAME} ${SOURCE_FILES})

if (${ARCH} STREQUAL "X86_64")
  target_link_libraries(${PROJECT_NAME} ${CMAKE_SOURCE_DIR}/../build/linux_x86_64/Release/libjsrt.so)
elseif (${ARCH} STREQUAL "ARM64") # android
  target_link_libraries(${PROJECT_NAME} ${CMAKE_SOURCE_DIR}/../build/android_arm64/Release/libjsrt.so)
endif()
