'use strict';
var logger = include('android_logger');
var fs = require('fs');
const FILE_BROWSER_JSON = global.__dirname + '/../Store/res/filebrowser.json';
if (!fs.existsSync(FILE_BROWSER_JSON)) {
  fs.writeFileSync(FILE_BROWSER_JSON,
    '{\"files\": {\"untitled\": [],\"recent\": [],\"open\": []},' +
      '\"folders\": {\"open\": []}}', (err) => {
    if (err) throw err;
  });
}
debugger;
var jsonFiles = require(FILE_BROWSER_JSON);

if (!jsonFiles.files) {
  jsonFiles.files = {}
}

if (!jsonFiles.folders) {
  jsonFiles.folders = {}
}

var FilebrowserStoreImpl = function() {

  let me = this;

  this.RES_DIRECTORY = global.__dirname + '/../Store/res';
  this.UNTITLED_FILES_DIRECTORY = this.RES_DIRECTORY + '/untitled/';

  //console.log('UNTITLED_FILES_DIRECTORY=' + this.UNTITLED_FILES_DIRECTORY);

  this.getFiles = function(type) {
    switch(type) {
      case 'untitled':
          return jsonFiles.files.untitled;
      case 'open':
        return jsonFiles.files.open;
      case 'recent':
        return jsonFiles.files.recent;
    }
    return new Array();
  };

  this.getFolders = function(type) {
    switch(type) {
      case 'open':
        return jsonFiles.folders.open;
      case 'recent':
        return jsonFiles.folders.recent;
    }
    return new Array();
  };

  this.updateUntitledFiles = function(fileName) {
    let path = this.UNTITLED_FILES_DIRECTORY + fileName;
    let idx = this.untitledFiles.indexOf(path);
    if (idx === -1) {
      this.untitledFiles.push(path);
    } else {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      this.untitledFiles.splice(idx, 1);
    }
    // save json
    //jsonFiles.files.untitled = this.untitledFiles;
    //console.log(jsonFiles);
    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
        if (error) {
          console.log(error);
        }
      });
  };

  this.updateOpenFiles = function(path, what) {
    let idx = this.openFiles.indexOf(path);
    switch (what) {
      case 'INSERT':
        if (idx === -1) {
          this.openFiles.push(path);
          // also update recent
          if (this.recentFiles.indexOf(path) === -1) {
            this.recentFiles.push(path);
          }
        } else {
          return;
        }
        break;
      case 'REMOVE':
        if (idx !== -1) {
          this.openFiles.splice(idx, 1);
        }
        break;
    }

    //console.log(jsonFiles);

    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
        if (error) {
          console.log(error);
        }
      });
  };

  this.updateOpenFolders = function(path) {
    debugger;
    if (this.openFolders.indexOf(path) === -1) {
      this.openFolders.push(path);
    }
    // save json
    // jsonFiles.folders.open = this.openFolders;
    console.log(jsonFiles);
    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
      if (error) {
        console.log(error);
      }
    });
  };

  this.saveNewDocument = function(fileName, html) {
    let path = this.UNTITLED_FILES_DIRECTORY + fileName;
    if (this.untitledFiles.indexOf(path) === -1) {
      this.untitledFiles.push(path);
    }
    // save json
    //jsonFiles.files.untitled = this.untitledFiles;
    console.log(jsonFiles);

    if (!fs.existsSync(this.UNTITLED_FILES_DIRECTORY)) {
      fs.mkdirSync(this.UNTITLED_FILES_DIRECTORY);
    }

    fs.writeFileSync(path, html, function(error) {
      if (error) {
        console.log(error);
      }
    });
    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
      if (error) {
        console.log(error);
      }
    });
  }

  this.isUntitled = function(action) {
    if (action[0].fileName !== undefined) {
      return me.untitledFiles.indexOf(me.UNTITLED_FILES_DIRECTORY + action[0].fileName) !== -1 ? true : false;
    } else {
      console.log('action[0].fileName is undefined');
    }
    return false;
  }

  this.saveFile = function(filePath, html) {
    // todo: why update recent on save file?
    /*if (this.recentFiles.indexOf(filePath) === -1) {
      this.recentFiles.push(filePath);
    }
    // save json
    jsonFiles.files.recent = this.recentFiles;*/
    //console.log(jsonFiles);
    debugger;
    fs.writeFileSync(filePath, html, function(error) {
      if (error) {
        console.log(error);
      }
    });
    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
      if (error) {
        console.log(error);
      }
    });
  }

  this.removeInvalidPaths = function(files) {
    let removed = false;
    if (files !== undefined) {
      // remove non existent paths
      for (var i = files.length - 1; i >= 0; --i) {
        if (!fs.existsSync(files[i])) {
          files.splice(i, 1);
          removed = true;
        }
      }
    }
    return removed;
  }

  this.refreshOpenFolders = function() {
    let removed = me.removeInvalidPaths(me.openFolders);
    if (removed) {
      fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  this.openFiles = this.getFiles('open');

  let removed = this.removeInvalidPaths(this.openFiles);

  debugger;
  this.untitledFiles = this.getFiles('untitled');

  removed |= this.removeInvalidPaths(this.untitledFiles);

  /*if (this.untitledFiles !== undefined) {
    // remove non existent paths
    for (var i = this.untitledFiles.length - 1; i >= 0; --i) {
      if (!fs.existsSync(this.untitledFiles[i])) {
        this.untitledFiles.splice(i, 1);
        removed = true;
      }
    }
  }*/

  this.recentFiles =  this.getFiles('recent');

  removed |= this.removeInvalidPaths(this.recentFiles);

  debugger;
  this.openFolders = this.getFolders('open');

  removed |= this.removeInvalidPaths(this.openFolders);

  if (removed) {
    fs.writeFileSync(FILE_BROWSER_JSON, JSON.stringify(jsonFiles, null, 2), function(error) {
      if (error) {
        console.log(error);
      }
    });
  }
};

var exports = {
  // todo: this should be renamed FileStore
  FilebrowserStore : function () {

    let me = this;

    let storeBase = include('flux/storebase');

    let store = storeBase.StoreBase('FILEBROWSER_STORE');

    let impl = new FilebrowserStoreImpl;

    //console.log('open files:', impl.openFiles);
    store.init = function() {
      store.subscribe('isUntitled', impl.isUntitled);

      store.callbackMap.get('updateUntitledFiles').call(impl.untitledFiles);
      store.callbackMap.get('updateOpenFiles').call(impl.openFiles);
      store.callbackMap.get('updateRecentFiles').call(impl.recentFiles);
      store.callbackMap.get('updateOpenFolders').call(impl.openFolders);
    }

    // override
    store.action = function(action) {

      if (action[0].to === undefined || action[0].to !== store.NAME) {
        return;
      }

      console.log('FilebrowserStore.action:' + action[0].type);

      switch (action[0].type) {
        case 'UPDATE_OPEN_FILES':
          // note: what = 'INSERT', 'REMOVE' is not used
          if (action[0].filePath !== undefined && action[0].what !== undefined) {
            impl.updateOpenFiles(action[0].filePath, action[0].what);
            //console.log(impl.openFiles);
            store.callbackMap.get('updateOpenFiles').call(impl.openFiles);
            store.callbackMap.get('updateRecentFiles').call(impl.recentFiles);
          }
          break;
        case 'UPDATE_OPEN_FOLDERS':
          if (action[0].folderPath !== undefined) {
            impl.updateOpenFolders(action[0].folderPath);
            //console.log(impl.openFolders);
            let actuator = store.callbackMap.get('updateOpenFolders');
            if (actuator !== undefined) {
              actuator.call(impl.openFolders);
            } else {
              console.log('FilebrowserStore.action: updateOpenFolders callback is undefined');
            }
          }
          break;
        case 'SAVE_NEW_DOCUMENT':
          if (action[0].fileName !== undefined &&
              action[0].html !== undefined) {
            impl.saveNewDocument(action[0].fileName, action[0].html);
          }
          break;
        case 'SAVE_FILE':
          if (action[0].filePath !== undefined &&
              action[0].html !== undefined) {
            impl.saveFile(action[0].filePath, action[0].html);
          }
          break;
        case 'NEW_FILE':
            logger.log('FilebrowserStore NEW_FILE...');
            if (action[0].fileName !== undefined) {
              impl.updateUntitledFiles(action[0].fileName);
            }
            logger.log('FilebrowserStore NEW_FILE Debug1');
          break;
        case 'REMOVE_UNTITLED_FILE':
            if (action[0].fileName !== undefined) {
              impl.updateUntitledFiles(action[0].fileName);
            }
          break;
        case 'REFRESH_OPEN_FOLDERS':
          impl.refreshOpenFolders();
          let actuator = store.callbackMap.get('updateOpenFolders');
          if (actuator !== undefined) {
            actuator.call(impl.openFolders);
          } else {
            console.log('FilebrowserStore.action: updateOpenFolders callback is undefined');
          }
          break;
        default:
          console.log('FilebrowserStore unknown action type');
          break;
      }
    }

    return store;
  }
};

var onincluded = function() {
  console.log('FilebrowserStore onincluded...');
  return exports;
};

