'use strict';

var obs = require('../lib/obs.js');

exports.obs = {
  getObjectSchema: {
    setUp: function(callback) {
      this.objectSingle = {
        a: 'a',
        b: 'b'
      };
      this.objectMulti = {
        a: {
          aa: 'aa'
        },
        b: 'b'
      };
      this.objectArrayValue = {
        a: ['aa', {aaa: 'aaa'}],
        b: {
          ba: ['baa', 'bab']
        }
      };
      this.objectFunction = function() { return 'Hello, World!'; };

      callback();
    },

    testFunctionArguments: function(test) {
      test.expect(4);

      test.deepEqual(obs.getObjectSchema(''), {},
        'Empty object is returned by default.');

      test.deepEqual(obs.getObjectSchema({}), {},
        'Empty object is accepted as function argument.');

      test.deepEqual(obs.getObjectSchema([]), {},
        'Array is not accepted as function argument.');

      test.deepEqual(obs.getObjectSchema(this.objectFunction), {},
        'Function is not accepted as function argument.');

      test.done();
    },

    testComparison: function(test) {
      var schemaObjectSingle = {
            a: '',
            b: ''
          },
          schemaObjectMulti = {
            a: {
              aa: ''
            },
            b: ''
          },
          schemaObjectArrayValue = {
            a: '',
            b: {
              ba: ''
            }
          };

      test.expect(3);

      test.deepEqual(obs.getObjectSchema(this.objectSingle), schemaObjectSingle,
        'Single-dimensional object schema is correctly returned.');

      test.deepEqual(obs.getObjectSchema(this.objectMulti), schemaObjectMulti,
        'Multi-dimensional object schema is correctly returned.');

      test.deepEqual(obs.getObjectSchema(this.objectArrayValue), schemaObjectArrayValue,
        'Array values are not recursed or included.');

      test.done();
    }
  },

  mergeObjectSchema: {
    setUp: function(callback) {
      this.objectSingle1 = {
        a: 'a',
        b: ''
      };
      this.objectSingle2 = {
        a: '`a',
        b: 'b',
        c: 'c'
      };
      this.objectSingle3 = {
        d: 'd'
      };

      this.objectMulti1 = {
        a: {},
        c: ''
      };
      this.objectMulti2 = {
        a: '',
        b: {
          ba: 'ba',
          bb: ['bba', {bbaa: 'bbaa'}],
          bc: {
            bca: 'bca'
          }
        },
        c: {
          ca: 'ca'
        }
      };
      this.objectArray = ['a', 'b', 'c'];
      this.objectFunction = function() { return 'Hello, World!'; };

      callback();
    },
    testMergeObjectSchema: function(test) {
      var mergedSchemaSingle = obs.mergeObjectSchema(this.objectSingle1, this.objectSingle2),
          mergedSchemaMulti = obs.mergeObjectSchema(this.objectMulti1, this.objectMulti2);

      test.expect(7);

      test.deepEqual(obs.mergeObjectSchema(this.objectArray), this.objectArray,
        'Non-objects are not processed (Array).');

      test.deepEqual(obs.mergeObjectSchema(this.objectFunction), this.objectFunction,
        'Non-objects are not processed (function).');

      test.equal(mergedSchemaSingle.b, '',
        'Property value is not overridden (empty string)');

      test.equal(mergedSchemaSingle.a, 'a',
        'Property value is not overridden (string)');

      test.deepEqual(mergedSchemaMulti.a, {},
        'Property value is not overridden (object)');

      test.equal(mergedSchemaSingle.c, '',
        'Property value is not copied.');

      test.deepEqual(mergedSchemaMulti.b, {ba: '', bb: '', bc: {bca: ''}},
        'Multi-dimensional object keys are copied.');

      test.done();
    }
  },

  sortObjectSchema: {
    setUp: function(callback) {
      this.objectSingle = {
        c: 'c',
        a: 'a',
        b: 'b'
      };
      this.objectMulti = {
        c: 'c',
        b: 'b',
        a: {
          ac: 'ac',
          aa: 'aa',
          ab: 'ab'
        }
      };

      callback();
    },
    testSortObjectSchema: function(test) {
      // Objects are first sorted using sortObj, then converted into arrays
      // using Object.keys. The order of the keys is then checked index by
      // index. Didn't figure any better way to compare object property order.
      var sortedObject, sortedObjectKeys;

      test.expect(12);

      // Ascending sort (single).
      sortedObject = obs.sortObjectSchema(this.objectSingle, {sortOrder: 'asc'});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'c', 'Ascending sort (single): C');
      test.equal(sortedObjectKeys[1], 'b', 'Ascending sort (single): B');
      test.equal(sortedObjectKeys[2], 'a', 'Ascending sort (single): A');

      // Ascending sort (multi).
      sortedObject = obs.sortObjectSchema(this.objectMulti, {sortOrder: 'asc'});
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys[0], 'ac', 'Ascending sort (multi): C');
      test.equal(sortedObjectKeys[1], 'ab', 'Ascending sort (multi): B');
      test.equal(sortedObjectKeys[2], 'aa', 'Ascending sort (multi): A');

      // Descending sort (single).
      sortedObject = obs.sortObjectSchema(this.objectSingle, {sortOrder: 'desc'});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'a', 'Descending sort (single): A');
      test.equal(sortedObjectKeys[1], 'b', 'Descending sort (single): B');
      test.equal(sortedObjectKeys[2], 'c', 'Descending sort (single): C');

      // Descending sort (multi).
      sortedObject = obs.sortObjectSchema(this.objectMulti, {sortOrder: 'desc'});
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys[0], 'aa', 'Descending sort (multi): A');
      test.equal(sortedObjectKeys[1], 'ab', 'Descending sort (multi): B');
      test.equal(sortedObjectKeys[2], 'ac', 'Descending sort (multi): C');

      test.done();
    }
  }
};
