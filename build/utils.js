const fs = require('fs');
const execSync = require('child_process').execFileSync;

function isEmpty(str) {
  return (!str || str.length === 0);
}

/**
 * @description Run git with clone arguments.
 * In case the location exits it executes a git pull on that location.
 * @param {*} url - url of the git repo
 * @param {*} clone_folder - folder where the git repo is cloned;
 *                           it is relative path to cwd
 * @param {*} tag - git tag to checkout
 */
function git_clone_or_update(url, clone_folder, tag) {
  if (!fs.existsSync(clone_folder)) {
    exec('git', ['clone', url, clone_folder]);
    if (!isEmpty(tag)) {
      change_dir(clone_folder);
      exec('git', ['checkout', tag]);
    }
  }
  else {
    change_dir(clone_folder);
    if (isEmpty(tag)) {
      exec('git', ['pull']);
    }
  }
}

/**
 * Log and execute a command with arguments.
 * @param {*} command
 * @param {*} arguments
 */
function exec(command, arguments) {
  if (arguments !== undefined) {
    console.log('run|' + command + ' ' + arguments.join(' '));
  } else {
    console.log('run|' + command);
  }
  execSync(command, arguments);
}

/**
 * @description Run cmake build command with arguments.
 * @param {*} build - build type: debug, release
 * @param {*} arch - architecture type: x86, x86_64
 */
function cmake_build(homeDir, buildType, config, arch, use_v8) {
  exec('cmake', ['-DCMAKE_BUILD_TYPE=' + buildType, homeDir, '-DCONFIG:STRING=' + config, '-DARCH:STRING=' + arch.toUpperCase(),'-DUSE_V8:=' + use_v8.toString().toUpperCase()]);
}

function make(arch) {
  if (arch.toUpperCase() === 'ARM') {
    exec('make');
  }
  else {
    exec('make', ['-j4']);
  }
}

function MsBuild(solutionPath, buildType) {
  exec('C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\MSBuild\\Current\\Bin\\MSBuild.exe', [solutionPath, "-p:Configuration=" + buildType]);
}

function clean_build(rootDir) {
  //exec('rm', ['-rf','output']);
  if (fs.existsSync(rootDir +'build/output')) {
    fs.rmdirSync(rootDir + 'build/output', { recursive: true });
  }
}

function clean_all(rootDir) {
  //exec('rm', ['-rf','output']);
  //exec('rm', ['-rf','../deps']);
  //exec('rm', ['-rf','../addons/sciter/output']);
  console.log(rootDir);
  if (fs.existsSync(rootDir +'build/output')) {
    fs.rmdirSync(rootDir + 'build/output', { recursive: true });
  }
  if (fs.existsSync(rootDir +'deps')) {
    fs.rmdirSync(rootDir + 'deps', { recursive: true });
  }
  if (fs.existsSync(rootDir +'addons/sciter/output')) {
    fs.rmdirSync(rootDir + 'addons/sciter/output', { recursive: true });
  }
}

function copy_resources(configuration)
{
  for (var index in dubJSON.configurations) {
    var config = dubJSON.configurations[index];
    if (config.name == configuration) {
      var imagesdir = config.targetPath + '/images';
      if (!fs.existsSync(imagesdir)) {
        fs.mkdirSync(imagesdir);
      }
      fs.copyFile('images/ground_1024.png', imagesdir + '/ground_1024.png', (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
}

function change_dir(command) {
  process.chdir(command);
  console.log('cwd|' + process.cwd());
}

module.exports = {
  change_dir,
  git_clone_or_update,
  exec,
  cmake_build,
  make,
  MsBuild,
  isEmpty,
  clean_build,
  clean_all
};
