'use strict';
const mainPresenterModule = include('/../Main/MainPresenter');
const notePresenterModule = include('/../Note/NotePresenter');
const toolbarPresenterModule = include('/../Toolbar/ToolbarPresenter');
const filebrowserPresenterModule = include('/../Filebrowser/FilebrowserPresenter');
const actuatorModule = include('actuator/actuator');

var exports = {
  mainPresenter : {},

  notePresenter : {},

  toolbarPresenter : {},

  filebrowserPresenter : {},

  init : function(sciter, fluxDispatcher, appController) {
    this.mainPresenter = new mainPresenterModule.Presenter(sciter, fluxDispatcher);
    this.notePresenter = new notePresenterModule.Presenter(sciter, fluxDispatcher);
    this.toolbarPresenter = new toolbarPresenterModule.Presenter(sciter, fluxDispatcher);
    this.filebrowserPresenter = new filebrowserPresenterModule.Presenter(sciter, fluxDispatcher);

    actuatorModule.connect_duplex('sendEvent', 'receiveEvent', appController, this.mainPresenter);
    actuatorModule.connect_duplex('sendEvent', 'receiveEvent', appController, this.notePresenter);
    actuatorModule.connect_duplex('sendEvent', 'receiveEvent', appController, this.toolbarPresenter);
    actuatorModule.connect_duplex('sendEvent', 'receiveEvent', appController, this.filebrowserPresenter);
  }
};

var onincluded = function() {
  console.log('Presenters onincluded...');
  return exports;
};

