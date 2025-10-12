'use strict';
// set node stuff to global space
global.require = require;
global.__dirname = __dirname;

/*let opts;
var player = require('play-sound')(opts = {players: ['play']})

//var audio = player.play(__dirname + '/../music/Chris-Stapleton-Tennessee-Whiskey.mp3', {play:['-S']},function(err){
var audio = player.play(__dirname + '/../music/Choir of Young Believers - Hollow Talk + (from Bron Broen).mp3', {play:['-S']},function(err){
  if (err) throw err
})*/

const MODULES_PARENT_DIR = __dirname + '/../../..';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
//console.log(jsrtcore.GetModulesDirectory());
// sciter
const sciter = include('sciter/sciter_macos');
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

sciter.init();

sciter.getDirName = function() {
  return __dirname;
}

global.app_api = {};
global.app_api.GetModulesDirectory = function() {
  console.log("app_api.GetModulesDirectory...")
  return jsrtcore.GetModulesDirectory();
}

//sciter.setDebugMode();

sciter.createView();
sciter.loadFile(__dirname + '/../Main/MainView.htm');

// UI is ready we can initialize it
store.init();

sciter.expand();

// This will run UI loop. It will suppress uv_loop.`
// The app will be responsible for the io async ops.
sciter.run()

//audio.kill();


