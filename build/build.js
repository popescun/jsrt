const utils = require('./utils.js')
const fs = require('fs');
const execSync = require('child_process').execFileSync;
const buildJSON = require('./build.json');
const readline = require('readline');

//console.log(buildJSON);

const CONFIG = buildJSON.configuration;

// this is actually jsrt root dir
const ROOT_DIR = process.cwd() + '/../';
utils.change_dir(ROOT_DIR);

const cmdLineArgs = process.argv;

// command line arguments
var buildType = 'Debug'

// todo: use only ARGUMENTS, and get rid of vars above
const ARGUMENTS = {
  BUILD_TYPE: {
    DEBUG: 'Debug',
    RELEASE: 'Release'
  },
  DEPS_UPDATE: ['deps-update', false],
  NO_UNTANGLED: ['no-untangled', false],
  V8_BUILD: ['v8-build', false],
  USE_V8: ['use-v8', false],
  CLEAN_BUILD: ['clean-build', false],
  CLEAN_ALL: ['clean-all', false],
  BUILD_ADDON: ['addon-build', false, '']
}
Object.freeze(ARGUMENTS);

// todo: move this processing in utils.js
for (var idx in cmdLineArgs) {
  if (idx < 2) {
    continue;
  }
  let arg = cmdLineArgs[idx];
  let tokens = arg.split(':');
  let command = tokens[0];
  let param = tokens[1];
  switch (command) {
    case ARGUMENTS.BUILD_TYPE.DEBUG:
    case ARGUMENTS.BUILD_TYPE.RELEASE:
      buildType = arg;
      break;
    case ARGUMENTS.DEPS_UPDATE[0]:
      ARGUMENTS.DEPS_UPDATE[1] = true;
      break;
    case ARGUMENTS.NO_UNTANGLED[0]:
      ARGUMENTS.NO_UNTANGLED[1] = true;
      break;
    case ARGUMENTS.V8_BUILD[0]:
      ARGUMENTS.V8_BUILD[1] = true;
      ARGUMENTS.USE_V8[1] = true;
      break;
    case ARGUMENTS.USE_V8[0]:
      ARGUMENTS.USE_V8[1] = true;
      break;
    case ARGUMENTS.CLEAN_BUILD[0]:
      ARGUMENTS.CLEAN_BUILD[1] = true;
      break;
    case ARGUMENTS.CLEAN_ALL[0]:
      ARGUMENTS.CLEAN_ALL[1] = true;
      break;
    case ARGUMENTS.BUILD_ADDON[0]:
      ARGUMENTS.BUILD_ADDON[1] = true;
      ARGUMENTS.BUILD_ADDON[2] = param;
      break;
    default:
      console.log('argument ' + arg + ' is unknown');
      process.exit();
      break;
  }
}

const depsNames = Object.getOwnPropertyNames(buildJSON.dependencies);
console.log("dependencies:", depsNames);

/*const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

if (ARGUMENTS.BUILD_ADDON[1]) {
  rl.question('addon name?', function(answer) {
    console.log(`addon name: ${answer}`);
    rl.close();
  });

  rl.on('line', function(line){
    console.log(line);
  })

  process.exit();
}*/

if (ARGUMENTS.CLEAN_BUILD[1]) {
  utils.clean_build(ROOT_DIR);
  process.exit();
}

if (ARGUMENTS.CLEAN_ALL[1]) {
  utils.clean_all(ROOT_DIR);
  if (!ARGUMENTS.DEPS_UPDATE[1]) {
    process.exit();
  }
}

// set architecture and build directory
var arch = 'x86';
var buildDir = 'build';
for (var idx in buildJSON.configurations) {
  let config = buildJSON.configurations[idx];
  if (CONFIG === config.name) {
    arch = config.architecture;
    buildDir = config.rootBuildDirectory + '/' + config.name + '/' + buildType;
    break;
  }
}

// get or update dependencies
if (ARGUMENTS.DEPS_UPDATE[1]) {
  for (var depName in buildJSON.dependencies) {

    if (depName === 'untangled' && ARGUMENTS.NO_UNTANGLED[1]) {
      continue;
    }

    var deps_obj = buildJSON.dependencies[depName];

    // clone repo
    if (deps_obj.enabled === undefined || deps_obj.enabled === true) {
      utils.git_clone_or_update(deps_obj.url, deps_obj.path, deps_obj.tag);
    }

    // set up depot_tools
    if (depName === 'depot_tools' && ARGUMENTS.V8_BUILD[1]) {
      utils.change_dir(ROOT_DIR + '/' + deps_obj.path);

      process.env['PATH'] = process.env['PATH'] + ':' + process.cwd();
      //console.log("PATH=" + process.env['PATH']);
      // check gclient is in the PATH
      utils.exec('gclient');
    }

    // build v8
    if (depName === 'v8' && ARGUMENTS.V8_BUILD[1]) {
      utils.change_dir('deps');
      if (!fs.existsSync('v8')) {
        utils.exec('fetch', ['v8']);
      }
      utils.change_dir('v8');
      // checkout git tag
      /*if (!utils.isEmpty(dependency_obj.tag)) {
        console.log('execute git checkout ' + dependency_obj.tag);
        execSync('git', ['checkout', dependency_obj.tag]);
      }*/

      // todo: check if we are already on master
      utils.exec('git', ['checkout', 'master']);

      // stay up to date
      utils.exec('git', ['pull']);
      utils.exec('gclient', ['sync']);

      if (fs.existsSync('.gn') && !fs.existsSync('.gn_original')) {
        console.log('move .gn to .gn_original');
        fs.renameSync('.gn', '.gn_original');
      }
      console.log('copy /config/v8/.gn to .gn');
      fs.copyFileSync(ROOT_DIR + '/config/v8/.gn', '.gn');

      // run generation and compile commands
      utils.exec('tools/dev/v8gen.py', ['x64.'+ buildType.toLowerCase()]);
      utils.exec('ninja', ['-C', 'out.gn/x64.' + buildType.toLowerCase()]);
    }

    // build node
    if (depName === 'node' &&
        (deps_obj.enabled === undefined || deps_obj.enabled === true) &&
        !ARGUMENTS.USE_V8[1]) {
      utils.change_dir(ROOT_DIR + '/' + deps_obj.path);

      // enable it for v11.12.0
      //console.log('copy /config/node/common.gypi to common.gypi');
      //fs.copyFileSync(ROOT_DIR + '/config/node/common.gypi', 'common.gypi');

      // todo: apply config/patches/node_13.0.0_inspector.patch
      if (deps_obj.tag === 'v13.0.0' && false) {
        utils.exec('git', ['apply','../../config/patches/node_13.0.0_inspector.patch']);
      }

      if (buildType === 'Debug') {
        if (CONFIG === 'windows_x86_64') {
          utils.exec('.\\vcbuild.bat', ['vs2019', 'Debug']);
        } else {
          utils.exec('./configure', ['--shared', '--debug']);
          utils.make(arch);
        }
      }
      else {
        if (CONFIG === 'windows_x86_64') {
          utils.exec('.\\vcbuild.bat', ['vs2019', 'Release']);
          utils.MsBuild(ROOT_DIR + 'deps/node/node.sln', buildType)
        } else {
          utils.exec('./configure', ['--shared']);
          utils.make(arch);
        }
      }
    }

    utils.change_dir(ROOT_DIR);
  }
}

// todo: copy v8 libs to pre-build for --use-prebuild build?

// build addon
let addonDir = ROOT_DIR + 'addons/' + ARGUMENTS.BUILD_ADDON[2];
if (ARGUMENTS.BUILD_ADDON[1]) {
  utils.change_dir(addonDir);
}

if (!fs.existsSync(buildDir)){
  console.log('mkdir ' + buildDir);
  fs.mkdirSync(buildDir, {recursive: true}, (err) => {
    if (err) {
      throw err;
    }
  });
}

utils.change_dir(buildDir);
if (ARGUMENTS.BUILD_ADDON[1]) {
  utils.cmake_build(addonDir, buildType, CONFIG, arch, ARGUMENTS.USE_V8[1]);
}
else {
  utils.cmake_build(ROOT_DIR, buildType, CONFIG, arch, ARGUMENTS.USE_V8[1]);
}
utils.make(arch);





