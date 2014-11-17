'use strict';

var Camelton = require('../index.js');

exports.index = {
  camelton: {
    testInitialization: function(test) {
      var source = 'tests/fixtures/source-1.json',
          destination = 'tests/fixtures/destination-1.json',

          camelton = new Camelton(source, destination),
          cameltonCustomized = new Camelton(source, destination, {sort: 'asc'});

      test.expect(6);

      // Using `new` is enforced in constructor.
      test.ok(Camelton(source, destination) instanceof Camelton, // jshint ignore:line
        'Using `new` is enforced in constructor.');

      // Throws an error if no source file is defined.
      test.throws(
        function() {
          new Camelton(null, destination);
        },
        Error,
        'Throws an error if no source file is defined.'
      );
      // Throws an error if no destination file is defined.
      test.throws(
        function() {
          new Camelton(source, null);
        },
        Error,
        'Throws an error if no destination file is defined.'
      );
      // An array of files is supported as destination.
      test.doesNotThrow(
        function() {
          new Camelton(source, [destination]);
        },
        Error,
        'An array of files is supported as destination.'
      );

      // Creates an options object with defaults.
      // - Currently on sort option available. Sort option is added only if
      //   defined, hence the empty default object.
      test.deepEqual(camelton.options, {},
        'Creates an options object with defaults.');
      // Creates an options object with user specified value.
      // - Supported values `asc` and `desc`.
      test.deepEqual(cameltonCustomized.options, {sortObjOptions: {sortOrder: 'asc'}, sort: 'asc'},
        'Creates an options object with user specified values.');

      test.done();
    }
  }
};
