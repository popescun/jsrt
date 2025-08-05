'use strict';
global.require = require;
global.__dirname = __dirname;
const MODULES_PARENT_DIR = __dirname + '/../../../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);

var logger = include('android_logger');
const activity = include('android_activity');
const sciter = include('sciter/sciter_android');

global.sciter = sciter;

sciter.setDebugMode();

var nativeActivity = activity.getNativeActivity();
//logger.log(nativeActivity);
//var savedState = activity.getSavedState();
//var savedStateSize = activity.getSavedStateSize();

sciter.setNativeActivity(nativeActivity);

while (!sciter_android.displayEngineReady()) {

}

// flux
const fluxDispatcherModule = include('flux/dispatcher');

// store
const store = include('/../Store/Store');

// mvp
const appCtrlModule = include('sciter/mvp/AppController');
const presenters = include('/Presenters');

// setup flux
var fluxDispatcher = new fluxDispatcherModule.Dispatcher(store.getAll());


// setup presenters
var appController = new appCtrlModule.Controller();
presenters.init(sciter, fluxDispatcher, appController);

// subscribe presenters to stores
store.subscribeCallbacks(presenters);

sciter.getDirName = function() {
  return __dirname;
}

sciter.loadFile(__dirname + '/../Main/MainView.htm');

//store.init();

const main_iteration = () => {
  sciter.main_iteration();
};

const run = () => {
  if (sciter_android.nativeWindowExist()) {
    main_iteration();
    setTimeout(run, 1);
  } else {
    logger.log('exit run...');
  }
};

run();

logger.log('exit script...');