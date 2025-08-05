'use strict';
// set node stuff to global space
global.require = require;
global.__dirname = __dirname;
const MODULES_PARENT_DIR = __dirname + '/../../..';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
// sciter
const sciter = include('sciter/sciter_glfw');
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

//sciter.init();

sciter.getDirName = function() {
  return __dirname;
}

global.app_api = {};
global.app_api.GetModulesDirectory = function() {
  return jsrtcore.GetModulesDirectory();
}

//sciter.setDebugMode();

sciter.init();

sciter.loadFile(__dirname + '/../Main/MainView.htm');
//sciter.loadFile('/home/nicu/git/javascript/jsrt/deps/sciter/demos.lite/facade/main.htm');

// UI is ready we can initialize it
store.init();

sciter.drawLoop();

appController.sendEvent.call({from:'APPLICATION', to:'MAIN', type: 'CLOSING'});
