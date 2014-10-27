'use strict';

var obs = require('../lib/obs.js');

exports.obs = {
  getObjectSchema: {
    setUp: function(callback) {
      this.objectSingle = {
        foo: 'bar',
        bar: 'baz'
      };
      this.objectMulti = {
        foo: {
          bar: 'baz'
        },
        bar: 'baz'
      };
      this.objectArrayValue = {
        foo: ['bar', {baz: 'foo'}],
        bar: {
          baz: ['foo', 'bar']
        }
      };
      callback();
    },

    testFunctionArguments: function(test) {
      test.expect(4);

      test.deepEqual(obs.getObjectSchema(''), {},
        'Empty object is returned by default.');

      test.deepEqual(obs.getObjectSchema({}), {},
        'Empty object is accepted as function argument.');

      test.deepEqual(obs.getObjectSchema(['foo', 'bar']), {},
        'Array is not accepted as function argument.');

      test.deepEqual(obs.getObjectSchema(function() {}), {},
        'Function is not accepted as function argument.');

      test.done();
    },

    testComparison: function(test) {
      var schemaObjectSingle = {
            foo: '',
            bar: ''
          },
          schemaObjectMulti1 = {
            foo: {
              bar: ''
            },
            bar: ''
          },
          schemaObjectArrayValue = {
            foo: '',
            bar: {
              baz: ''
            }
          };

      test.expect(3);

      test.deepEqual(obs.getObjectSchema(this.objectSingle), schemaObjectSingle,
        'Single-dimensional object schema is correctly returned.');

      test.deepEqual(obs.getObjectSchema(this.objectMulti), schemaObjectMulti1,
        'Multi-dimensional object schema is correctly returned.');

      test.deepEqual(obs.getObjectSchema(this.objectArrayValue), schemaObjectArrayValue,
        'Array values are not recursed or included.');

      test.done();
    }
  },

  mergeObjectSchema: {
    setUp: function(callback) {
      this.objectSingle1 = {
        foo: 'bar',
        baz: ''
      };
      this.objectSingle2 = {
        foo: 'baz',
        baz: 'foo',
        bar: 'baz'
      };
      this.objectSingle3 = {
        qux: 'quux'
      };

      this.objectMulti1 = {
        foo: {},
        baz: ''
      };
      this.objectMulti2 = {
        foo: '',
        bar: {
          baz: 'foo',
          bar: ['baz', {foo: 'bar'}],
          foo: {
            bar: 'baz'
          }
        },
        baz: {
          foo: 'bar'
        }
      };

      callback();
    },
    testmergeObjectSchema: function(test) {
      var mergedSchemaSingle = obs.mergeObjectSchema(this.objectSingle1, this.objectSingle2),
          mergedSchemaMulti = obs.mergeObjectSchema(this.objectMulti1, this.objectMulti2);

      test.expect(5);

      test.equal(mergedSchemaSingle.baz, '',
        'Property value is not overridden (empty string)');

      test.equal(mergedSchemaSingle.foo, 'bar',
        'Property value is not overridden (string)');

      test.deepEqual(mergedSchemaMulti.foo, {},
        'Property value is not overridden (object)');

      test.equal(mergedSchemaSingle.bar, '',
        'Property value is not copied.');

      test.deepEqual(mergedSchemaMulti.bar, {baz: '', bar: '', foo: {bar: ''}},
        'Multi-dimensional object keys are copied.');

      test.done();
    }
  }
};
