'use strict';
// jscs: disable jsDoc

var fs = require('fs'),
    sinon = require('sinon'),
    Camelton = require('../index.js');

exports.index = {
  camelton: {
    setUp: function(callback) {
      this.source              = './tests/fixtures/source-1.json';
      this.sourceCorrupt       = './tests/fixtures/source-1-corrupt.json';
      this.destination         = './tests/fixtures/destination-1.json';
      this.destinationCorrupt  = './tests/fixtures/destination-1-corrupt.json';

      callback();
    },

    testInitialization: function(test) {
      var _this = this,

          camelton = new Camelton(this.source, this.destination),
          cameltonCustomized = new Camelton(this.source, this.destination, {
            sort: 'asc',
            verbose: true,
            prune: true,
            placeholder: true
          });

      test.expect(6);

      // Using `new` is enforced in constructor.
      test.ok(Camelton(this.source, this.destination) instanceof Camelton, // jshint ignore:line
        'Using `new` is enforced in constructor.');

      // Throws an error if no source file is defined.
      test.throws(
        function() {
          new Camelton(null, _this.destination);
        },
        Error,
        'Throws an error if no source file is defined.'
      );
      // Throws an error if no destination file is defined.
      test.throws(
        function() {
          new Camelton(_this.source, null);
        },
        Error,
        'Throws an error if no destination file is defined.'
      );
      // An array of files is supported as destination.
      test.doesNotThrow(
        function() {
          new Camelton(_this.source, [_this.destination]);
        },
        Error,
        'An array of files is supported as destination.'
      );

      // Creates an options object with defaults.
      test.deepEqual(camelton.options, {verbose: false, prune: false, placeholder: false},
        'Creates an options object with defaults.');
      // Creates an options object with user specified values.
      test.deepEqual(cameltonCustomized.options, {
            verbose: true,
            prune: true,
            placeholder: true,
            sort: 'asc'
          },
          'Creates an options object with user specified values.');

      test.done();
    },

    testRun: function(test) {
      var _this = this;

      test.expect(2);

      // Throws an error if source file is not valid JSON.
      test.throws(
        function() {
          var camelton = new Camelton(_this.sourceCorrupt, _this.destination);
          camelton.run();
        },
        Error,
        'Throws an error if source file is not valid JSON.'
      );
      // Silently fails if destination file is not valid JSON (does not throw).
      test.doesNotThrow(
        function() {
          var camelton = new Camelton(_this.source, _this.destinationCorrupt);
          camelton.run();
        },
        Error,
        'Silently fails if destination file is not valid JSON (does not throw).'
      );

      test.done();
    },

    testJSONFormatting: function(test) {
      var camelton, output;

      test.expect(1);

      // Writes JSON with default spacing of 2.
      camelton = new Camelton(this.source, this.destination);
      camelton.run();

      output = fs.readFileSync(this.destination, 'utf8');

      test.equal(output, '{\n  "foo": ""\n}\n',
        'Writes JSON with default spacing of 2');

      test.done();
    },

    testStatistics: function(test) {
      var camelton;

      test.expect(4);

      camelton = new Camelton(this.source, this.destination);
      camelton.run();
      test.strictEqual(camelton.statistics.modified.length, 1,
          'Statistics: Modified count matches (1).');
      test.strictEqual(camelton.statistics.rejected.length, 0,
          'Statistics: Rejected count matches (0).');

      camelton = new Camelton(this.source, this.destinationCorrupt);
      camelton.run();
      test.strictEqual(camelton.statistics.modified.length, 0,
          'Statistics: Modified count matches (0).');
      test.strictEqual(camelton.statistics.rejected.length, 1,
          'Statistics: Rejected count matches (1).');

      test.done();
    },

    testReportAddline: function(test) {
      var camelton;

      test.expect(6);

      camelton = new Camelton(this.source, this.destination);

      // Does not print a line if no files are provided.
      test.equal(camelton.reportAddLine([], null, null), '',
        'Does not print a line if files are not provided.');

      // Provides sensible default values.
      test.equal(
        camelton.reportAddLine(['file.json'], null, null),
        '\nℹ: 1 file.',
        'Provides sensible default values.');

      // Prints a log symbol if provided with supported option.
      test.equal(
        camelton.reportAddLine(['file.json'], null, 'success'),
        '\n✔: 1 file.',
        'Prints a log symbol if provided with supported option.');

      // Prints out the name of the category.
      test.equal(
        camelton.reportAddLine(['file.json'], 'category', null),
        '\nℹ category: 1 file.',
        'Prints out the name of the category.');

      // Pluralizes the word `file` if more than one file.
      test.equal(
        camelton.reportAddLine(['file-1.json', 'file-2.json'], null, null),
        '\nℹ: 2 files.',
        'Pluralizes the word `file` if more than one file.');

      // Prints out file names if verbose option is on.
      camelton = new Camelton(this.source, this.destination, {verbose: true});
      test.equal(
        camelton.reportAddLine(['file.json'], null, null),
        '\nℹ: 1 file.\n  file.json',
        'Prints out file names if verbose option is on.');

      test.done();
    },

    testReport: function(test) {
      var camelton, spy, pathToDestinationFile;

      test.expect(4);

      pathToDestinationFile = __dirname.concat(this.destination.replace('./tests', ''));

      camelton = new Camelton(this.source, this.destination);
      spy = sinon.spy(camelton, 'reportAddLine');
      sinon.spy(console, 'log');

      camelton.run();
      camelton.report();

      test.ok(spy.calledTwice,
        'reportAddLine is called once for modified and rejected files.');

      test.ok(spy.calledWith([pathToDestinationFile], 'Modified', 'success'),
        'reportAddLine is called with a list of modified files.');
      test.ok(spy.calledWith([], 'Rejected', 'warning'),
        'reportAddLine is called with a list of rejected files.');

      test.ok(console.log.calledOnce,
        'Report is output using console.log.');

      camelton.reportAddLine.restore();
      console.log.restore();

      test.done();
    }
  }
};
