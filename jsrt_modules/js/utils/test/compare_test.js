'use strict';
var expect = require('chai').expect;

console.log('start...');

const MODULES_PARENT_DIR = __dirname + '/../../../../';
jsrtcore.SetModulesDirectory(MODULES_PARENT_DIR);
const compare = include('utils/compare');

//console.log(compare);

describe('default compare', function(){
  describe('equal integers', function() {
    it('should return \'true\' when the values are equal', function() {
      expect(compare.equal(0, 0)).to.equal(true);
    });
  });

  describe('not equal integers', function() {
    it('should return \'false\' when the values are not equal', function() {
      expect(compare.equal(0, 1)).to.equal(false);
    });
  });

  describe('equal strings', function() {
    it('should return \'true\' when the strings are equal', function() {
      expect(compare.equal('a', 'a')).to.equal(true);
    });
  });

  describe('lessThan integers', function() {
    it('should return \'true\' when first is lessThan second', function() {
      expect(compare.lessThan(1, 2)).to.equal(true);
    });
  });

  describe('negative lessThan positive', function() {
    it('should return \'true\' when first is negative and second is positive', function() {
      expect(compare.lessThan(-1, 2)).to.equal(true);
    });
  });

  describe('lessThan strings 1', function() {
    it('should return \'true\' when first is lessThan second', function() {
      expect(compare.lessThan('a', 'b')).to.equal(true);
    });
  });

  describe('lessThan strings 2', function() {
    it('should return \'true\' when first is lessThan second', function() {
      expect(compare.lessThan('a', 'ab')).to.equal(true);
    });
  });

  describe('lessThan integers when first is greater', function() {
    it('should return \'false\' when first is greaterThan second', function() {
      expect(compare.lessThan(10, 2)).to.equal(false);
    });
  });

  describe('lessThanOrEqual integers when first is greater', function() {
    it('should return \'false\' when first is greaterThan second', function() {
      expect(compare.lessThanOrEqual(10, 2)).to.equal(false);
    });
  });

  describe('lessThanOrEqual integers when they are equal 1', function() {
    it('should return \'true\' when they are equal', function() {
      expect(compare.lessThanOrEqual(1, 1)).to.equal(true);
    });
  });

  describe('lessThanOrEqual integers when they are equal 2', function() {
    it('should return \'true\' when they are equal', function() {
      expect(compare.lessThanOrEqual(0, 0)).to.equal(true);
    });
  });

  describe('greaterThan integers when they are equal', function() {
    it('should return \'false\' when they are equal', function() {
      expect(compare.greaterThan(0, 0)).to.equal(false);
    });
  });

  describe('greaterThan integers', function() {
    it('should return \'false\' when first is greater than second', function() {
      expect(compare.greaterThan(10, 0)).to.equal(true);
    });
  });

  describe('greaterThanOrEqual integers 1', function() {
    it('should return \'false\' when first is greater than second', function() {
      expect(compare.greaterThanOrEqual(10, 0)).to.equal(true);
    });
  });

  describe('greaterThanOrEqual integers 2', function() {
    it('should return \'true\' when they are equal', function() {
      expect(compare.greaterThanOrEqual(10, 0)).to.equal(true);
    });
  });

  describe('greaterThanOrEqual integers 3', function() {
    it('should return \'false\' when first is less than second', function() {
      expect(compare.greaterThanOrEqual(0, 10)).to.equal(false);
    });
  });
});

describe('custom compare', function(){
  let compare = include('utils/compare');;
  compare.setCompareFunction((a, b) => {
    if (a.length === b.length) {
      return 0;
    }
    return a.length < b.length ? -1 : 1;
  });

  describe('equal string length', function() {
    it('should return \'true\' when they have same length', function() {
      expect(compare.equal('a', 'b')).to.equal(true);
    });
  });

  describe('not equal string length', function() {
    it('should return \'false\' when they don\'t have the same length', function() {
      expect(compare.equal('a', '')).to.equal(false);
    });
  });

  describe('lessThan string length', function() {
    it('should return \'true\' when first length is less than second', function() {
      expect(compare.lessThan('b', 'aa')).to.equal(true);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'false\' when first length is less than second', function() {
      expect(compare.greaterThanOrEqual('a', 'aa')).to.equal(false);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'true\' when first length is greater than second', function() {
      expect(compare.greaterThanOrEqual('aa', 'a')).to.equal(true);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'true\' when they are equal', function() {
      expect(compare.greaterThanOrEqual('a', 'a')).to.equal(true);
    });
  });
});


describe('custom compare reverse', function(){
  let compare = include('utils/compare');;
  compare.setCompareFunction((a, b) => {
    if (a.length === b.length) {
      return 0;
    }
    return a.length < b.length ? -1 : 1;
  });

  compare.reverse();

  describe('equal string length', function() {
    it('should return \'true\' when they have same length', function() {
      expect(compare.equal('b', 'a')).to.equal(true);
    });
  });

  describe('not equal string length', function() {
    it('should return \'false\' when they don\'t have the same length', function() {
      expect(compare.equal('a', '')).to.equal(false);
    });
  });

  describe('lessThan string length', function() {
    it('should return \'false\' when first length is less than second', function() {
      expect(compare.lessThan('b', 'aa')).to.equal(false);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'true\' when first length is less than second', function() {
      expect(compare.greaterThanOrEqual('a', 'aa')).to.equal(true);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'false\' when first length is greater than second', function() {
      expect(compare.greaterThanOrEqual('aa', 'a')).to.equal(false);
    });
  });

  describe('greaterThanOrEqual string length', function() {
    it('should return \'true\' when they are equal', function() {
      expect(compare.greaterThanOrEqual('a', 'a')).to.equal(true);
    });
  });
});