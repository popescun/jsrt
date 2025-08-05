'use strict';
var exports = {

  Presenter : function (sciterObj, fluxDispatcher, appController) {

    let me = this;

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'MAIN', fluxDispatcher, appController);

    let closing = function() {
      presenter.sendEvent.call({from:presenter.PLACE, to:'NOTE', type: 'SAVE_NEW_DOCUMENTS'});
    }

    // override
    presenter.receiveEvent = function(event) {
      console.log('MainPresenter receiveEvent...');

      if (event[0].to === presenter.PLACE) {
        console.log('MainPresenter event place...');
      } else {
        return;
      }

      switch (event[0].type) {
        case 'CLOSING':
          //console.log('MainPresenter CLOSING event...');
          closing();
          break;
      }
    }

    global.sciter_main = {};

    global.sciter_main.closing = function(reason) {
      console.log('MainPresenter.closing...');
      //console.log(reason);
      closing();
      sciterObj.dismiss();
    }

    global.sciter_main.save_button_click = function(reason) {
      console.log('MainPresenter.save_button_click...');
      presenter.sendEvent.call({from: "MAIN", to: "NOTE", type: "SAVE_FILE"});
    }

    global.sciter_main.slide_menu = function(reason) {
      presenter.sendEvent.call({from: "MAIN", to: "TOOLBAR", type: "SLIDE_MENU"});
    }

    // UI updaters
    // state = args[0], reason = args[1]
    presenter.updateEditState = function(args) {
      console.log('MainPresenter.updateEditState...');
      presenter.sciterObj.call('SaveButtonElement.updateEditState', args[0]);
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('MainPresenter onincluded...');
  return exports;
};

