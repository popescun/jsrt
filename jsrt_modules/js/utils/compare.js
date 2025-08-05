'use strict';
function create(){
  function defaultCompare(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  let compare = defaultCompare;

  function setCompareFunction(compareFunction) {
    compare = compareFunction;
  }

  function equal(a, b) {
    return compare(a, b) === 0;
  }

  function lessThan(a, b) {
    return compare(a, b) === -1;
  }

  function greaterThan(a, b) {
    return compare(a, b) === 1;
  }

  function lessThanOrEqual(a, b) {
    return lessThan(a, b) || equal(a, b);
  }

  function greaterThanOrEqual(a, b) {
    return greaterThan(a, b) || equal(a, b);
  }

  function reverse(a, b) {
    let compareOriginal = compare;
    compare = (a, b) => compareOriginal(b, a);
  }

  return Object.freeze({
    setCompareFunction,
    equal,
    lessThan,
    greaterThan,
    lessThanOrEqual,
    greaterThanOrEqual,
    reverse
  })
}


var onincluded = function() {
console.log('compare onincluded...');
return create();
};