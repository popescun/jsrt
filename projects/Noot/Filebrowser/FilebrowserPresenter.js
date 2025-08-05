//'use strict';
var path = require('path');
var fs = require('fs');
//const dirTree = require('directory-tree');
var exports = {

  Presenter : function (sciterObj, fluxDispatcher, appController) {

    let me = this;

    let presenterBase = include('sciter/mvp/PresenterBase');

    let presenter = presenterBase.PresenterBase(sciterObj, 'FILEBROWSER', fluxDispatcher, appController);

    // override
    presenter.receiveEvent = function(event) {
      console.log('FilebrowserPresenter receiveEvent...');

      if (event[0].to === presenter.PLACE) {
        console.log('FilebrowserPresenter event place...');
        // call in App.tis
        switch (event[0].type) {
          case 'SELECT_OPEN_FILE':
            if (event[0].filePath !== undefined) {
              presenter.sciterObj.call('FilebrowserView.selectOpenFile', event[0].filePath);
            }
            break;
        }
      }
    }

    // UI handlers (invoked in FilebrowserView.tis)
    // create new sciter global object for this presenter
    // todo: can we improve to not create so many globals?
    global.sciter_filebrowser = {};

    global.sciter_filebrowser.tree_click = function(filePath) {
      console.log('FilebrowserPresenter.tree_click...');
      presenter.sendEvent.call({from:presenter.PLACE, to:'NOTE', type: 'ACTIVATE_TAB', filePath: filePath});
    }

    global.sciter_filebrowser.leaf_folders_dblclick = function(filePath) {
      console.log('FilebrowserPresenter.leaf_folders_dblclick...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'UPDATE_OPEN_FILES', what: 'INSERT', filePath: filePath});
    }

    global.sciter_filebrowser.button_refresh_click = function() {
      console.log('FilebrowserPresenter.button_refresh_click...');
      fluxDispatcher.dispatchAction({from:presenter.PLACE, to:'FILEBROWSER_STORE', type: 'REFRESH_OPEN_FOLDERS'});
    }

    // UI updaters
    presenter.updateOpenFiles = function(filesArr) {
      console.log('FilebrowserPresenter.updateOpenFiles...');
      let files = filesArr[0];
      //console.log(files);
      let html =
      '<select|tree>';// +
        //'<option.caption>' +
          //'<caption>Open files</caption>';
      for (let i = 0; i < files.length; i++) {
        let filePath = files[i];
        //html += '<option.leaf filePath=\"' + filePath + '\">' + path.basename(filePath) + '<span>' + filePath + '</span></option>';
        html += '<option#leaf_files filePath=\"' + filePath + '\">' + path.basename(filePath) + '</option>';
      }
      //html += '</option>' +
      '</select>';
      // todo update element html
      presenter.sciterObj.call('FilebrowserView.updateOpenFiles', html);
    }

    presenter.updateRecentFiles = function(filesArr) {
      console.log('FilebrowserPresenter.updateRecentFiles...');
      let files = filesArr[0];
      let html =
      '<select|tree>';// +
        //'<option.caption>' +
          //'<caption>Open files</caption>';
      for (let i = 0; i < files.length; i++) {
        let filePath = files[i];
        //html += '<option.leaf filePath=\"' + filePath + '\">' + path.basename(filePath) + '<span>' + filePath + '</span></option>';
        html += '<option#leaf_recent filePath=\"' + filePath + '\">' + path.basename(filePath) + '</option>';
      }
      //html += '</option>' +
      '</select>';
      presenter.sciterObj.call('FilebrowserView.updateRecentFiles', html);
    }

    presenter.updateOpenFolders = function(foldersArr) {
      console.log('FilebrowserPresenter.updateOpenFolders...');
      //console.log(folders);
      let folders = foldersArr[0];
      let html =
      '<select|tree>';// +
        //'<option>' +
        //  '<caption>Open folders</caption>';

      let openFolders = [];
      for (let i = 0; i < folders.length; i++) {
        let folder = folders[i];
        html += '<option>' +
          '<caption>' + folder + '</caption>';
        openFolders.push(folder);
        openFolders[folder] = [];
        let files = fs.readdirSync(folder);
        for (let j = 0; j < files.length; j++) {
          let filePath = path.join(folder,files[j]);
          let fileStat = fs.lstatSync(filePath);
          if (fileStat !== undefined &&
              fileStat.isFile() &&
              filePath.indexOf('.noot') >= 0) {
            openFolders[folder].push(files[j]);
            html += '<option#leaf_folders filePath=\"' + filePath + '\">' + files[j] + '</option>';
            //console.log('-- found: ',files[j]);
          }

        }
        html += '</option>';
      }
      html += '</option>' +
        '</select>';
      presenter.sciterObj.call('FilebrowserView.updateOpenFolders', html);
    }

    return presenter;
  }
};

var onincluded = function() {
  console.log('FilebrowserPresenter onincluded...');
  return exports;
};

