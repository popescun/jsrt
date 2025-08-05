'use strict';
const filebrowserStoreModule = include('/../Store/FilebrowserStore');
const noteStoreModule = include('/../Store/NoteStore');

var exports = {
  FilebrowserStore : new filebrowserStoreModule.FilebrowserStore(),

  NoteStore : new noteStoreModule.NoteStore(),

  getAll : function() {
    return [this.FilebrowserStore, this.NoteStore];
  },

  subscribeCallbacks : function(presenters) {
    this.FilebrowserStore.subscribe('updateOpenFiles', presenters.filebrowserPresenter.updateOpenFiles);
    this.FilebrowserStore.subscribe('updateOpenFiles', presenters.notePresenter.updateOpenFiles);
    this.FilebrowserStore.subscribe('updateRecentFiles', presenters.filebrowserPresenter.updateRecentFiles);
    this.FilebrowserStore.subscribe('updateOpenFolders', presenters.filebrowserPresenter.updateOpenFolders);
    this.FilebrowserStore.subscribe('updateUntitledFiles', presenters.notePresenter.updateUntitledFiles);
    this.NoteStore.subscribe('insertImage', presenters.notePresenter.insertImage);
    this.NoteStore.subscribe('newFile', presenters.notePresenter.newFile);
    this.NoteStore.subscribe('onRequestNewDocuments', presenters.notePresenter.onRequestNewDocuments);
    this.NoteStore.subscribe('requestActiveDocument', presenters.notePresenter.requestActiveDocument);
    this.NoteStore.subscribe('updateEditState', presenters.toolbarPresenter.updateEditState);
    this.NoteStore.subscribe('updateEditState', presenters.mainPresenter.updateEditState);
  },

  init : function() {
    this.FilebrowserStore.init();
    this.NoteStore.init();
  }
};

var onincluded = function() {
  console.log('Store onincluded...');
  return exports;
};

