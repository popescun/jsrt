project(sciter_android_addon)

if (${ARCH} STREQUAL "ARM64") # android
  set(ANDROID_NODE /home/builder/termux-packages/output/nodejs/src/)
  set(TERMUX_OUTPUT /home/builder/termux-packages/output/)
  set(LIB_DIR ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/sysroot/usr/lib/aarch64-linux-android/24)
  set(CMAKE_C_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android-clang)
  set(CMAKE_CXX_COMPILER ${TERMUX_OUTPUT}/_cache/android-r20-api-24-v2/bin/aarch64-linux-android-clang++)
endif()

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

#add_definitions(-DWINDOWLESS)

#message(FATAL_ERROR "CMAKE_CURRENT_SOURCE_DIR=${CMAKE_CURRENT_SOURCE_DIR}")

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
  ../shared
  src)


#add source files
set(SOURCE_FILES
  src/jsrt_sciter_android.cpp
  ../shared/jsrt_sciter_value.cpp
  #src/android_native_app_glue.cpp
  src/main.cpp
  src/sciter_android_bridge.cpp
  #${JSRT_DIR}/deps/sciter/include/behaviors/behavior_drawing.cpp
)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/output/lib/${CMAKE_BUILD_TYPE})

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

find_library(android-lib NAMES android HINTS "${LIB_DIR}")

find_library(egl-lib NAMES EGL HINTS "${LIB_DIR}")

find_library(gles-lib NAMES GLESv1_CM HINTS "${LIB_DIR}")

find_library(gles2-lib NAMES GLESv2 HINTS "${LIB_DIR}")

target_link_libraries(${PROJECT_NAME}
${JSRT_DIR}/deps/sciter/bin.android/ARM64/libsciter.so
#${android-lib} ${gles-lib} ${gles2-lib} ${egl-lib}
${android-lib}
${ANDROID_NODE}/out/${CMAKE_BUILD_TYPE}/obj.target/libnode.so
-L/data/data/com.termux/files/usr/lib -lcares -lm -ldl -llog)




