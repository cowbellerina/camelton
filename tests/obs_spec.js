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
      // Objects are first processed, then converted into arrays using
      // Object.keys. The order of the keys is then checked index by index.
      // Haven't figured any better way to compare object property order.
      var sortedObject, sortedObjectKeys;

      test.expect(27);

      // Unsorted (single).
      // - source object property order is used.
      sortedObject = obs.mergeObjectSchema(this.objectSingle, {b: '',  a: '', c: ''});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'b', 'Unsorted (single): B');
      test.equal(sortedObjectKeys[1], 'a', 'Unsorted (single): A');
      test.equal(sortedObjectKeys[2], 'c', 'Unsorted (single): C');

      // Unsorted (single).
      // - source object property order is used.
      // - extra properties are preserved and added to the end of the object in
      //   their original order.
      sortedObject = obs.mergeObjectSchema(this.objectSingle, {a: ''});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'a',
          'Unsorted (single): extra properties are preserved: A');
      test.equal(sortedObjectKeys[1], 'c',
          'Unsorted (single): extra properties are preserved: C');
      test.equal(sortedObjectKeys[2], 'b',
          'Unsorted (single): extra properties are preserved: B');

      // Unsorted (multi).
      // - source object property order is used.
      sortedObject = obs.mergeObjectSchema(this.objectMulti, {
        b: '',
        a: {ab: '', aa: '', ac: ''},
        c: ''
      });
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys[0], 'ab', 'Unsorted (multi): B');
      test.equal(sortedObjectKeys[1], 'aa', 'Unsorted (multi): A');
      test.equal(sortedObjectKeys[2], 'ac', 'Unsorted (multi): C');

      // Unsorted (single, prune).
      // - source object property order is used.
      // - extra properties are removed from destination object.
      sortedObject = obs.mergeObjectSchema(this.objectSingle, {b: '', a: ''}, true);
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys.length, 2, 'Unsorted (single, prune)');
      test.equal(sortedObjectKeys[0], 'b', 'Unsorted (single, prune): B');
      test.equal(sortedObjectKeys[1], 'a', 'Unsorted (single, prune): A');

      // Unsorted (multi, prune).
      // - source object property order is used.
      // - extra properties are removed from destination object.
      sortedObject = obs.mergeObjectSchema(this.objectMulti, {
        b: '',
        a: {ab: '', ac: ''},
        c: ''
      }, true);
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys.length, 2, 'Unsorted (multi, prune)');
      test.equal(sortedObjectKeys[0], 'ab', 'Unsorted (multi, prune): B');
      test.equal(sortedObjectKeys[1], 'ac', 'Unsorted (multi, prune): C');

      // Ascending sort (single).
      sortedObject = obs.sortObjectSchema(this.objectSingle, {sort: 'asc'});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'a', 'Ascending sort (single): A');
      test.equal(sortedObjectKeys[1], 'b', 'Ascending sort (single): B');
      test.equal(sortedObjectKeys[2], 'c', 'Ascending sort (single): C');

      // Ascending sort (multi).
      sortedObject = obs.sortObjectSchema(this.objectMulti, {sort: 'asc'});
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys[0], 'aa', 'Ascending sort (multi): A');
      test.equal(sortedObjectKeys[1], 'ab', 'Ascending sort (multi): B');
      test.equal(sortedObjectKeys[2], 'ac', 'Ascending sort (multi): C');

      // Descending sort (single).
      sortedObject = obs.sortObjectSchema(this.objectSingle, {sort: 'desc'});
      sortedObjectKeys = Object.keys(sortedObject);

      test.equal(sortedObjectKeys[0], 'c', 'Descending sort (single): C');
      test.equal(sortedObjectKeys[1], 'b', 'Descending sort (single): B');
      test.equal(sortedObjectKeys[2], 'a', 'Descending sort (single): A');

      // Descending sort (multi).
      sortedObject = obs.sortObjectSchema(this.objectMulti, {sort: 'desc'});
      sortedObjectKeys = Object.keys(sortedObject.a);

      test.equal(sortedObjectKeys[0], 'ac', 'Descending sort (multi): C');
      test.equal(sortedObjectKeys[1], 'ab', 'Descending sort (multi): B');
      test.equal(sortedObjectKeys[2], 'aa', 'Descending sort (multi): A');

      test.done();
    }
  }
};
