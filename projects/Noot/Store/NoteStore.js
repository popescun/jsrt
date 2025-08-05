'use strict';
var logger = include('android_logger');
var path = require('path');
var NoteStoreImpl = function() {

  let me = this;

  this.UNTITLED_FILES_DIRECTORY = global.__dirname + '/../Store/res/untitled/';

  this.createDocument = function(newDocument, fileNameOrPath) {
    var Document = function(newDocument, fileNameOrPath) {
      this.newDocument = newDocument;
      this.fileName = newDocument ? fileNameOrPath : path.basename(fileNameOrPath);
      this.filePath = newDocument ? me.UNTITLED_FILES_DIRECTORY + fileNameOrPath : fileNameOrPath;
      this.editState = newDocument ? true : false;
    }
    return new Document(newDocument, fileNameOrPath);
  }

  this.newDocuments = new Array();

  this.openDocuments = new Array();

  this.activeDocument = {
    fileName: null,
    filePath: null
  }

  this.updateOpenFiles = function(path, what) {
    let idx = this.openDocuments.findIndex((element) => {
      return element.filePath === path;
    });
    switch (what) {
      case 'INSERT':
        if (idx === -1) {
          let document = this.createDocument(false, path);
          this.openDocuments.push(document);
          return document;
        }
        break;
      case 'REMOVE':
        if (idx !== -1) {
          this.openDocuments.splice(idx, 1);
        }
        break;
    }
    return undefined;
  }

  this.getOpenDocuments = function(action) {
    return me.openDocuments;
  }

  // todo: fileName is sent as filePath -> should be removed!
  this.updateEditState = function(fileName, filePath, editState) {
    debugger;
    let idx = this.newDocuments.findIndex((element) => {
      return element.filePath === filePath;
    });

    if (idx !== -1) {
      //this.newDocuments[idx].fileName = fileName;
      this.newDocuments[idx].filePath = filePath;
      this.newDocuments[idx].editState = editState;
      return;
    }

    idx = this.openDocuments.findIndex((element) => {
      return element.filePath === filePath;
    });

    if (idx !== -1) {
      //this.openDocuments[idx].fileName = fileName;
      this.openDocuments[idx].filePath = filePath;
      this.openDocuments[idx].editState = editState;
    }
  }

  this.getEditState = function(filePath) {
    let idx = this.newDocuments.findIndex((element) => {
      return element.filePath === filePath;
    });

    if (idx !== -1) {
      return this.newDocuments[idx].editState;
    }

    idx = this.openDocuments.findIndex((element) => {
      return element.filePath === filePath;
    });

    if (idx !== -1) {
      return this.openDocuments[idx].editState;
    }
  }
}

var exports = {
  NoteStore : function () {

    let me = this;

    let storeBase = include('flux/storebase');

    let store = storeBase.StoreBase('NOTE_STORE');

    let impl = new NoteStoreImpl;

    let getActiveDocument = function() {
      let actuator = store.callbackMap.get('requestActiveDocument')
      if (actuator !== undefined) {
        actuator.call();
        return actuator.results[0];
      } else {
        console.log('NoteStore getActiveDocument...FAIL: undefined actuator')
      }
    }

    //console.log('open files:', impl.openFiles);
    store.init = function() {
      store.subscribe('getOpenDocuments', impl.getOpenDocuments);
      store.subscribe('getActiveDocument', getActiveDocument);
      //store.callbackMap.get('updateOpenFiles')(impl.openFiles);
    }

    // override
    store.action = function(action) {
      if (action[0].to === undefined || action[0].to !== store.NAME) {
        return;
      }

      console.log('NoteStore.action:' + action[0].type);

      switch (action[0].type) {
        case 'INSERT_IMAGE':
            if (action[0].imagePath !== undefined) {
              //console.log(action[0].imagePath);
              store.callbackMap.get('insertImage').call(action[0].imagePath);
            }
          break;
        case 'NEW_FILE':
            logger.log('NoteStore NEW_FILE...');
            if (action[0].fileName !== undefined) {
              //console.log(action[0].fileName);
              let actuator = store.callbackMap.get('newFile');
              let document = new impl.createDocument(true, action[0].fileName);
              actuator.call(document.fileName, document.filePath);
              if (actuator.results[0])
              {
                impl.newDocuments.push(document);
                store.callbackMap.get('updateEditState').call(document.editState);
              }
            }
          break;
        case 'REMOVE_UNTITLED_FILE':
            if (action[0].fileName !== undefined) {
              //console.log(action[0].fileName);
              let idx = impl.newDocuments.findIndex((element) => {
                return element.fileName === action[0].fileName;
              });
              if (idx !== -1) {
                impl.newDocuments.splice(idx, 1);
                // ensure save buttons do not remain visible
              if (impl.newDocuments.length === 0 &&
                  impl.openDocuments.length === 0) {
                    // here we send als the reason to help button disablement only when there is no document
                    store.callbackMap.get('updateEditState').call(false, 'NO_DOCUMENT');
                  }
              }
            }
          break;
        case 'REQUEST_NEW_DOCUMENTS':
          //console.log('Request new documents...');
          store.callbackMap.get('onRequestNewDocuments').call(impl.newDocuments);
          break;
        case 'UPDATE_UNTITLED_FILES':
          console.log('Update loaded untitled documents...');
          if (action[0].fileName !== undefined) {
            //console.log(action[0].fileName);
            debugger;
            let document = new impl.createDocument(true, action[0].fileName);
            if (document !== undefined) {
              impl.newDocuments.push(document);
              store.callbackMap.get('updateEditState').call(document.editState);
            }
          }
          break;
        case 'UPDATE_OPEN_FILES':
            if (action[0].filePath !== undefined && action[0].what !== undefined) {
              let document = impl.updateOpenFiles(action[0].filePath, action[0].what);
              if (document !== undefined) { // means we inserted document
                store.callbackMap.get('updateEditState').call(document.editState);
                return;
              }
              // ensure save buttons do not remain visible
              if (impl.newDocuments.length === 0 &&
                  impl.openDocuments.length === 0) {
                    // here we send als the reason to help button disablement only when there is no document
                    store.callbackMap.get('updateEditState').call(false, 'NO_DOCUMENT');
              }
            }
            break;
        case 'UPDATE_ACTIVE_DOCUMENT':
              if (action[0].fileName !== undefined &&
                  action[0].filePath !== undefined) {
                impl.activeDocument.fileName =  action[0].fileName;
                impl.activeDocument.filePath =  action[0].filePath;
                debugger;
                let editState = impl.getEditState(impl.activeDocument.filePath);
                console.log('editState=' + editState);
                if (editState !== undefined) {
                  store.callbackMap.get('updateEditState').call(editState);
                }
              }
              break;
        case 'UPDATE_EDIT_STATE':
            if (action[0].state !== undefined &&
                action[0].fileName !== undefined &&
                action[0].filePath !== undefined) {
              impl.updateEditState(action[0].fileName, action[0].filePath, action[0].state);
              store.callbackMap.get('updateEditState').call(action[0].state);
            }
            break;
        default:
          console.log('NoteStore unknown action type');
          break;
      }
    }

    return store;
  }
};

var onincluded = function() {
  console.log('NoteStore onincluded...');
  return exports;
};

