## Java Script environment based on V8 JS engine

This was one of my old pet projects to demonstrate that a simple alternative to the `node.js` `CommonJS` module system using `require` function is possible.

## Features:
- introduces a new module loading function `include`. The new nodule system can work with both Java Script modules and native ones.
- there are several new modules provided in `jsrt_modules`: the native modules includes `dear_imgui` and `sciter`(TI version) bindings. The JS modules includes a a simplistic `flux` module for building application with flux architecture.
- embed `node.js` so all existent `npm` modules are usable.
- there is included an almost full fledged application in `projects/Noot`. It is a notes editor build on top of `sciter` engine. This application makes use of `flux` module.
- it uses a naive build system with the command tool and the configuration file in `build/build.js` and `build/build.json` respectively.

> **_NOTE:_** This repo is an import from a private `bitbucket` repo and some URI paths still refer to that. If those are fixed there might be a chance to be able to build the whole stuff. Take a look into `build/build.js` what are the build command options. However, as the project is no longer actively developed, it might require some dependencies updates(e.g. new `node.js`, `V8`) and some adaptations for using a newer c++ compiler. The single supported platform was `Linux` and it built last time on `Ubuntu 18`. Adding support for `Windows` and `MacOs` should be possible. It's pretty much about linking with the correct libs. Actually I had once an implementation for `Windows` which sadly it was not submitted.
  I found the projects quite entertaining and it
provided a lot of moments of pure excitements as programmer. As there is not too much documentation on how a java script module system can be implemented, I hope it will give you the same joy as I had.