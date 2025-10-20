project(sciter_macos_addon)

#add_definitions(-DWINDOWS)

include_directories(${JSRT_DIR}
  ${JSRT_DIR}/src
  ${JSRT_DIR}/src/utils
  ${JSRT_DIR}/deps/node/src
  ${JSRT_DIR}/deps/node/deps/v8
  ${JSRT_DIR}/deps/node/deps/v8/include
  ${JSRT_DIR}/deps/sciter
  ${JSRT_DIR}/deps/sciter/include
  ../shared
  src)


#add source files
set(SOURCE_FILES
  src/jsrt_sciter_macos.hpp
  src/jsrt_sciter_macos.mm
  ../shared/jsrt_sciter_value.cpp
  ${JSRT_DIR}/deps/sciter/include/sciter-osx-main.mm)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_HOME_DIRECTORY}/build/output/lib/${CONFIG}/${CMAKE_BUILD_TYPE})

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})


find_library(COCOA Cocoa)
if (NOT COCOA)
  message(FATAL_ERROR "Cocoa not found")
endif()
#message(STATUS "COCOA:${COCOA}")

#find_library(APPKIT AppKit)
#if (NOT APPKIT)
#  message(FATAL_ERROR "APPKIT not found")
#endif()
#message(STATUS "APPKIT:${APPKIT}")

target_link_libraries(${PROJECT_NAME}
    ${JSRT_DIR}/deps/node/out/${CMAKE_BUILD_TYPE}/libnode.137.dylib -ldl ${COCOA})





