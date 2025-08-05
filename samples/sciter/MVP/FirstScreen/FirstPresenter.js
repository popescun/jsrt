'use strict';
var exports = {

  Presenter : function (sciterObj) {

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'FIRST_SCREEN');

    // override
    presenter.event = function(args) {
      console.log('FirstPresenter event...');

      let event = args[0];
      //console.log('MainPresenter event: from:', event.from, 'to:', event.to, 'place:',presenter.PLACE);

      if (event.to === presenter.PLACE) {
        console.log('FirstPresenter event place...');
        // call in App.tis
        presenter.sciterObj.call('Application.openScreen', 'FirstScreen/FirstScreen.htm');
      }
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('FirstPresenter onincluded...');
  return exports;
};


