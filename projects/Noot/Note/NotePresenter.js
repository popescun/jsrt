'use strict';
var path = require('path');
var fs = require('fs');
var url = require('url');
var sciterView = include('sciter/View');
var logger = include('android_logger');
var exports = {

  Presenter : function (sciterObj, fluxDispatcher, appController) {

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'NOTE', fluxDispatcher, appController);

    // override
    presenter.receiveEvent = function(event) {
      console.log('NotePresenter receiveEvent...');

      if (event[0].to === presenter.PLACE) {
        console.log('NotePresenter event place...');
        switch (event[0].type) {
          case 'SAVE_NEW_DOCUMENTS':
              presenter.sciterObj.call('DivTabs.saveNewDocuments');
            break;
          case 'SAVE_FILE':
            //console.log('save file');
            debugger;
            let activeDocument  = presenter.sciterObj.call('DivTabs.getActiveDocument');
            // warning: name contains actually the path
            let fileName = path.basename(activeDocument.name);
            let results = fluxDispatcher.executeAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'isUntitled', fileName: fileName});
            let isUntitled = results[0];
            if (!isUntitled) {
              fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'SAVE_FILE', filePath: activeDocument.path, html: activeDocument.html});
              fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_EDIT_STATE', state: false, fileName: activeDocument.name, filePath: activeDocument.path});
            } else {
              if (!saveFile(activeDocument.html)) {
                return;
              }
              // update save button state
              fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_EDIT_STATE', state: false, fileName: activeDocument.name, filePath: activeDocument.path});
              // on saved remove file
              fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
              fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
              // todo: close untitled file and open the saved one
              presenter.sciterObj.call('DivTabs.closeActiveDocument');
            }
            break;
          case 'ACTIVATE_TAB':
            console.log('activate tab');
            if (event[0].filePath !== undefined) {
              presenter.sciterObj.call('DivTabs.activateTab', event[0].filePath);
            }
            break;
          case 'REMOVE_FORMATTING':
            console.log('remove formatting');
            presenter.sciterObj.call('DivTabs.removeFormatting');
            break;
          case 'FORMAT_BOLD':
            console.log('format bold');
            presenter.sciterObj.call('DivTabs.formatBold');
            break;
          case 'FORMAT_EMPHASIS':
            console.log('format emphasis');
            presenter.sciterObj.call('DivTabs.formatEmphasis');
            break;
          case 'FORMAT_SUPERSCRIPT':
            console.log('format superscript');
            presenter.sciterObj.call('DivTabs.formatSuperscript');
            break;
          case 'FORMAT_SUBSCRIPT':
            console.log('format subscript');
            presenter.sciterObj.call('DivTabs.formatSubscript');
            break;
          case 'FORMAT_UNDERLINE':
            console.log('format underline');
            presenter.sciterObj.call('DivTabs.formatUnderline');
            break;
          case 'FORMAT_DELETION':
            console.log('format deletion');
            presenter.sciterObj.call('DivTabs.formatDeletion');
            break;
          case 'FORMAT_PARAGRAPH':
            console.log('format paragraph');
            presenter.sciterObj.call('DivTabs.formatParagraph', event[0].index);
            break;
          case 'FORMAT_ORDERLIST':
            console.log('format orderlist');
            presenter.sciterObj.call('DivTabs.formatOrderlist');
            break;
          case 'FORMAT_UNORDERLIST':
            console.log('format unorderlist');
            presenter.sciterObj.call('DivTabs.formatUnorderlist');
            break;
          case 'FORMAT_CHECKLIST':
            console.log('format checklist');
            presenter.sciterObj.call('DivTabs.formatChecklist');
            break;
          case 'FORMAT_DEFINITIONLIST':
            console.log('format definitionlist');
            presenter.sciterObj.call('DivTabs.formatDefinitionlist');
            break;
          case 'FORMAT_BLOCKQUOTE':
            console.log('format blockquote');
            presenter.sciterObj.call('DivTabs.formatBlockquote');
            break;
          case 'FORMAT_PREFORMATTED':
            console.log('format preformatted');
            presenter.sciterObj.call('DivTabs.formatPreformatted');
            break;
          case 'INSERT_TABLE':
            console.log('insert table');
            presenter.sciterObj.call('DivTabs.insertTable',
              event[0].rows, event[0].cols, event[0].autoWidth,
              event[0].rowHeaders, event[0].colHeaders);
            break;
          case 'SHOW_SOURCE':
            console.log('show source');
            presenter.sciterObj.call('DivTabs.showSource');
            break;
        }
      }
    }

    let saveFile = function(html) {
      let mode = 'save';
      let filter = 'Noot files (*.noot)|*.noot';
      let ext = 'noot';
      let filePath = sciterView.selectFile(sciterObj, mode, filter, ext);
      console.log(filePath);

      if (filePath === undefined) {
        return false;
      }
      filePath = url.fileURLToPath(filePath);
      //filePath = filePath.replace(/ /g, '\\ ');

      //filePath = filePath.slice(7);

      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'SAVE_FILE', filePath: filePath, html: html});
      return true;
    }

    // UI handlers (invoked in NoteView.tis)

    // create new sciter global object for this presenter
    // todo: can we improve to not create so many globals?
    global.sciter_note = {};

    global.sciter_note.requestNewDocuments = function() {
      console.log('NotePresenter.requestNewDocuments...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'REQUEST_NEW_DOCUMENTS'});
    }

    global.sciter_note.saveNewDocument = function(fileName, html) {
      console.log('NotePresenter.saveNewDocument...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'SAVE_NEW_DOCUMENT', fileName: fileName, html: html});
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'NEW_DOCUMENT_SAVED', fileName: fileName});
    }

    global.sciter_note.closeFile = function(filePath, html, lightBoxResult) {
      let fileName = path.basename(filePath);
      console.log('NotePresenter.closeFile...');
      debugger;
      let results = fluxDispatcher.executeAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'isUntitled', fileName: fileName});
      let isUntitled = results[0];
      if (!isUntitled) {
        // todo: show close dialog
        // todo: check document edit status
        fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_OPEN_FILES', what: 'REMOVE', filePath: filePath});
        fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'UPDATE_OPEN_FILES', what: 'REMOVE', filePath: filePath});
      } else {
        let id = lightBoxResult;
        if (lightBoxResult === undefined) {
          // closing msgbox
          let type = 'alert';
          let text = 'Save changes to New file before closing?';
          let title = 'Closing';
          let buttons = [{id: 'CloseWithout', text: 'Close without saving'},
            {id: 'Cancel', text: 'Cancel'}, {id: 'Save', text:'Save'}];
          id = sciterView.msgbox(sciterObj, type, text, title, buttons);
        }

        switch(id) {
          case 'CloseWithout':
            // remove file
            fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
            fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
            break;
          case 'Cancel':
            return false;
          case 'Save':
            if (!saveFile(html)) {
              return false;
            }
            // on saved remove file
            fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
            fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'REMOVE_UNTITLED_FILE', fileName: fileName});
            break;
        }
      }
      return true;
    }

    global.sciter_note.isUntitled = function(fileName) {
      let results = fluxDispatcher.executeAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'isUntitled', fileName: fileName});
      return results[0];
    }

    global.sciter_note.updateEditState = function(state, fileName, filePath) {
      console.log('NotePresenter.updateEditState...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_EDIT_STATE', state: state, fileName: fileName, filePath: filePath});
    }

    global.sciter_note.updateActiveDocument = function(fileName, filePath) {
      console.log('NotePresenter.updateActiveDocument...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_ACTIVE_DOCUMENT', fileName: fileName, filePath: filePath});
      // TODO: this action should not be done if current event was triggered by file browse tree_click
      presenter.sendEvent.call({from:presenter.PLACE, to:'FILEBROWSER', type: 'SELECT_OPEN_FILE', filePath: filePath});
    }

    // UI updaters
    presenter.insertImage = function(imagePath) {
      console.log('NotePresenter.insertImage...');
      //console.log(imagePath);

      let path = imagePath[0].slice(7);

      presenter.sciterObj.call('DivTabs.insertImage', path);
    }

    //args[0] = fileName, args[0] = filePath
    presenter.newFile = function(args) {
      console.log('NotePresenter.newFile...');
      logger.log('NotePresenter.newFile...')
      if (presenter.sciterObj.call('DivTabs.newFile', args[0], args[1]))
      {
        logger.log('NotePresenter.newFile... Debug1')
        fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'NEW_FILE', fileName: args[0]});
        logger.log('NotePresenter.newFile... Debug2')
      } else {
        console.log('NotePresenter.newFile...FAIL');
        return false;
      }
      return true;
    }

    presenter.onRequestNewDocuments = function(documents) {
      console.log('NotePresenter.onRequestNewDocuments...');
      //console.log(documents);
      presenter.sciterObj.call('DivTabs.onRequestNewDocuments', documents[0]);
    }

    presenter.updateUntitledFiles = function(filesArr) {
      console.log('NotePresenter.updateUntitledFiles...');
      //console.log(files);
      let files = filesArr[0];
      for (var idx in files) {
        let fileName = path.basename(files[idx]);
        let html  = fs.readFileSync(files[idx], 'utf8');
        if (presenter.sciterObj.call('DivTabs.updateDocument', fileName, files[idx], html, true))
        {
          fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_UNTITLED_FILES', fileName: fileName});
        } else {
          console.log('NotePresenter.updateUntitledFiles...FAIL, fileName:' + fileName);
        }
      }
    }

    // documents type defined in NoteStore
    let isDocumentOpen = (documents, path) => {
      return documents !== undefined && (documents.findIndex((element) => {
        return element.filePath === path;
      }) !== -1);
    }

    presenter.updateOpenFiles = function(filesArr) {
      console.log('NotePresenter.updateOpenFiles...');
      let files = filesArr[0];
      let results = fluxDispatcher.executeAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'getOpenDocuments'});
      let openDocuments = undefined;
      if (results !== undefined) {
        openDocuments = results[0];
      }
      for (var idx in files) {
        let isOpen = isDocumentOpen(openDocuments, files[idx]);
        if (isOpen) {
          continue;
        }
        let fileName = path.basename(files[idx]);
        let html  = fs.readFileSync(files[idx], 'utf8');
        if (presenter.sciterObj.call('DivTabs.updateDocument', fileName, files[idx], html, false))
        {
          fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'NOTE_STORE', type: 'UPDATE_OPEN_FILES', what: 'INSERT', filePath: files[idx]});
        } else {
          console.log('NotePresenter.updateOpenFiles...FAIL, fileName:' + fileName);
        }
      }
    }

    presenter.requestActiveDocument = function() {
      console.log('NotePresenter.requestActiveDocument...');
      let activeDocument  = presenter.sciterObj.call('DivTabs.getActiveDocument');
      return {name: activeDocument.name, path: activeDocument.path, html: activeDocument.html};
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('NotePresenter onincluded...');
  return exports;
};

