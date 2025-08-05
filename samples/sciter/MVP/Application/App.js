'use strict';
const sciter = include('sciter/sciter');
const appCtrl = include('sciter/mvp/AppController');
const mainPresenter = include('/../MainScreen/MainPresenter');
const firstPresenter = include('/../FirstScreen/FirstPresenter');

var appController = new appCtrl.Controller(sciter);

appController.addPresenter(new mainPresenter.Presenter(sciter));
appController.addPresenter(new firstPresenter.Presenter(sciter));

sciter.init();

//sciter.setDebugMode();

sciter.getDirName = function() {
  return __dirname;
}

sciter.createView();
sciter.loadFile(__dirname + '/App.htm');
sciter.expand();

const main_iteration = () => {
  sciter.main_iteration();
};

const run = () => {
  main_iteration();
  if (sciter.existView()) {
    setTimeout(run, 1);
  }
};

run();
