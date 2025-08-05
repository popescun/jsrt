'use strict';

function create_linkedList(){
    let head;
    let tail;

    function toString() {
      console.log('head=' + head + ' tail=' + tail);
    }

    return Object.freeze({
      toString
    })
}


var onincluded = function() {
  console.log('linked_list onincluded...');
  return create_linkedList();
};
