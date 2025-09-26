## Java Script runtime environment based on V8 JS engine

This was one of my old pet projects to demonstrate that a simple alternative to the `node.js` `CommonJS` module system using `require` function is possible.

## Features:
- introduce a new module loading function `include`. The new nodule system can work with both Java Script modules and native ones.
- there are several new modules provided in `jsrt_modules`: the native modules includes `dear_imgui` and `sciter`(TI version) bindings. The JS modules includes a a simplistic `flux` module for building application with flux architecture.
- it can build using either `V8` libs or `libnode` library(that encompasses `V8` libs)
- integrate `node.js` runtime so all existent `npm` modules are usable.
- there is included an almost full fledged application in `projects/Noot`. It is a notes editor build on top of `sciter` engine. This application makes use of `flux` module.
- it uses a naive build system with the command tool and the configuration file in `build/build.js` and `build/build.json` respectively.
- contains an experimental integration for `android` based on `termux`.

## How to build 

You need to have `node.js` installed. From `build` directory run:
```shell
node build.js [OPTIONS]
```

### Build options:
Use `help` option to print all available command options: 
```shell
node build.js help
```
```shell
command options:

  DEBUG,RELEASE - Build dype

  deps-update - Pull and build dependencies before build

  v8-build - Build V8 libraries

  use-v8 - Build using V8 libraries

  clean-build - Clean build directory

  clean-all - Clean all, including dependecies

  addon-build[sciter|dear_imgui] - Build the specified addon

  help - Show command options

```

### Build steps
When starting from scratch, the typical steps are:
1. In `build.json` edit the `configuration` field for current build platform.
For instance, on macOS Apple Silicon:
```json
"configuration": "macos_arm64",
```
2. Update dependencies(i.e. they are specified in `build.json` in `dependencies` section) and build: 
```shell
node build.js deps-update
```
This will first fetch all required dependencies in `deps` directory, and then will build them. 
Normally this option has to be run once. If the dependencies are successfully built then the application executable is built. 
By default, the build type is `Debug`. It can be specified using `DEBUG|RELEASE` option:
```shell
node build.js deps-update Release
```
> [!WARNING]
> Building `node` make take a while, especially for `Debug`.
3. Build the application
```shell
node build.js [Release|Debug]
```

### Clean options
There are two options to do the clean-up:
1. Remove `build/output` directory:
```shell
node build.js clean-build
```
2. Remove build output and `deps` folder:
```shell
node build.js clean-all
```
