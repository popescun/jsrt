'use strict';
var sciterView = include('sciter/View');
var logger = include('android_logger');
var fs = require('fs');
var url = require('url');
var exports = {

  Presenter : function (sciterObj, fluxDispatcher, appController) {

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'TOOLBAR', fluxDispatcher, appController);

    // override
    presenter.receiveEvent = function(event) {
      console.log('ToolbarPresenter receiveEvent...');

      if (event[0].to === presenter.PLACE) {
        console.log('ToolbarPresenter event place...');
        switch (event[0].type) {
          case 'SLIDE_MENU':
              presenter.sciterObj.call('ToolbarView.slide_menu');
            break;
        }
      }
    }

    // todo: do not use sciter binding object for interoperability with tis
    //       instead use other object with unique name for this presenter
    //       button_new_file_click is added: add the rest
    global.sciter_toolbar = {};

    // UI handlers (invoked in ToolbarView.tis)
    global.sciter_toolbar.button_new_file_click = function() {
      //console.log('ToolbarPresenter.button_new_file_click...');
      logger.log('ToolbarPresenter.button_new_file_click...');
      let fileName = 'untitled_' + Date.now() + '.noot';

      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'NEW_FILE', fileName: fileName});
    }

    global.sciter_toolbar.button_open_file_click = function() {
      console.log('ToolbarPresenter.button_open_file_click...');
      let mode = 'open';
      let filter = 'Noot files (*.noot)|*.noot';
      let ext = 'noot';
      // notice that only the we need to use the sciter obj that has the native bindings(from main script)
      let path = sciterView.selectFile(sciterObj, mode, filter, ext);
      //console.log(path);

      if (path === undefined) {
        return;
      }

      path = url.fileURLToPath(path);
      //path = path.slice(7);

      var stats = fs.statSync(path);

      if (stats.isDirectory()) {
        return;
      }

      // dispatch an Action for updating editor with image
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'UPDATE_OPEN_FILES', what: 'INSERT', filePath: path});
    }

    global.sciter_toolbar.button_open_folder_click = function() {
      console.log('ToolbarPresenter.button_open_folder_click...');
      let path = sciterView.selectFolder(sciterObj);
      console.log(path);

      if (path === undefined) {
        return;
      }

      path = url.fileURLToPath(path);

      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'UPDATE_OPEN_FOLDERS', folderPath: path});
    }

    global.sciter_toolbar.button_save_file_click = function() {
      console.log('ToolbarPresenter.button_save_file_click...');
      presenter.sendEvent.call({from: 'TOOLBAR', to: 'NOTE', type: 'SAVE_FILE'});
    }

    global.sciter_toolbar.button_image_click = function() {
      console.log('ToolbarPresenter.button_image_click...');
      let mode = 'open';
      let filter = 'Pictures (*.png,*.jpg,*.gif,*.svg,*.webp) |' +
      '*.jpg;*.jpeg;*.png;*.gif;*.svg;*.webp |' +
      'All Files (*.*)|*.*';
      let ext = 'png';
      let path = sciterView.selectFile(sciterObj, mode, filter, ext);
      //console.log(path);

      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'INSERT_IMAGE', imagePath: path});
    }

    sciterObj.button_test_click = function() {
      console.log('ToolbarPresenter.button_test_click...');
      let params = {
        type: 1,//View.FRAME_WINDOW,
        url: __dirname + '/../Toolbar/test.htm',
        state: 0,//View.WINDOW_SHOWN,
        width: 400,
        height: 300,
        client: true,
        alignment: 5 // center of the screen
      }
      sciterView.window(this, params);
    }

    global.sciter_toolbar.button_tools_click = function(source) {
      console.log('ToolbarPresenter.button_tools_click...');
      presenter.sciterObj.call('ToolbarViewSecond.slide_menu', source);
    }

    global.sciter_toolbar.button_source_click = function() {
      console.log('ToolbarPresenter.button_source_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "SHOW_SOURCE"});
    }

    global.sciter_toolbar.popup_remove_click = function() {
      console.log('ToolbarPresenter.popup_remove_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "REMOVE_FORMATTING"});
    }

    global.sciter_toolbar.popup_bold_click = function() {
      console.log('ToolbarPresenter.popup_bold_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_BOLD"});
    }

    global.sciter_toolbar.popup_emphasis_click = function() {
      console.log('ToolbarPresenter.popup_emphasis_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_EMPHASIS"});
    }

    global.sciter_toolbar.popup_sup_click = function() {
      console.log('ToolbarPresenter.popup_sup_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_SUPERSCRIPT"});
    }

    global.sciter_toolbar.popup_sub_click = function() {
      console.log('ToolbarPresenter.popup_sub_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_SUBSCRIPT"});
    }

    global.sciter_toolbar.popup_underline_click = function() {
      console.log('ToolbarPresenter.popup_underline_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_UNDERLINE"});
    }

    global.sciter_toolbar.popup_del_click = function() {
      console.log('ToolbarPresenter.popup_del_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_DELETION"});
    }

    global.sciter_toolbar.popup_paragraph_click = function(index) {
      console.log('ToolbarPresenter.popup_paragraph_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_PARAGRAPH", index: index});
    }

    global.sciter_toolbar.button_orderlist_click = function() {
      console.log('ToolbarPresenter.button_orderlist_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_ORDERLIST"});
    }

    global.sciter_toolbar.button_checklist_click = function() {
      console.log('ToolbarPresenter.button_checklist_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_CHECKLIST"});
    }

    global.sciter_toolbar.button_definitionlist_click = function() {
      console.log('ToolbarPresenter.button_definitionlist_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_DEFINITIONLIST"});
    }

    global.sciter_toolbar.button_unorderlist_click = function() {
      console.log('ToolbarPresenter.button_unorderlist_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_UNORDERLIST"});
    }

    global.sciter_toolbar.button_blockquote_click = function() {
      console.log('ToolbarPresenter.button_blockquote_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_BLOCKQUOTE"});
    }

    global.sciter_toolbar.button_preformatted_click = function() {
      console.log('ToolbarPresenter.button_preformatted_click...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "FORMAT_PREFORMATTED"});
    }

    global.sciter_toolbar.insert_table = function(rows, cols, autoWidth, rowHeaders, colHeaders) {
      console.log('ToolbarPresenter.insert_table...');
      presenter.sendEvent.call({from: "TOOLBAR", to: "NOTE", type: "INSERT_TABLE",
        rows: rows, cols: cols, autoWidth: autoWidth, rowHeaders: rowHeaders, colHeaders: colHeaders});
    }

    // UI updaters
    // state = args[0], reason = args[1]
    presenter.updateEditState = function(args) {
      console.log('ToolbarPresenter.updateEditState...');
      console.log('ToolbarPresenter.updateEditState: reason=' + args[1]);
      presenter.sciterObj.call('ToolbarView.updateEditState', args[0], args[1]);
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('ToolbarPresenter onincluded...');
  return exports;
};

