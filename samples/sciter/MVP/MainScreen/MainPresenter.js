'use strict';
var exports = {

  Presenter : function (sciterObj) {

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'MAIN_SCREEN');

    // override
    presenter.event = function(args) {
      console.log('MainPresenter event...');

      let event = args[0];
      //console.log('MainPresenter event: from:', event.from, 'to:', event.to, 'place:',presenter.PLACE);

      if (event.to === presenter.PLACE) {
        console.log('MainPresenter event place...');
        // call in App.tis
        presenter.sciterObj.call('Application.openScreen', 'MainScreen/MainScreen.htm');
      }
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('MainPresenter onincluded...');
  return exports;
};

