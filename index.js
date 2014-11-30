'use strict';

var fs = require('fs'),
    fse = require('fs-extra'),
    _ = require('underscore'),
    logSymbols = require('log-symbols'),
    util = require('./lib/util.js'),
    obs = require('./lib/obs.js');

/**
 * Initialize Camelton.
 *
 * @param {string} source - source file
 * @param {string|Array} destination - destination file or an array of
 * destination files
 * @param {object} options - options object
 */
function Camelton(source, destination, options) {
  var _this = this;

  if (!(this instanceof Camelton)) {
    return new Camelton(source, destination, options);
  }

  /**
   * Parse options.
   *
   * @param {object} options - options object
   * @returns {object}
   */
  function parseOptions(options) {
    var defaultOptions = {
      verbose: false
    };
    options = options || {};

    if (options.sort) {
      if (_.isString(options.sort) && ['asc', 'desc'].indexOf(options.sort.toLowerCase()) !== -1) {
        defaultOptions.sortObjOptions = {
          sortOrder: options.sort
        };
      }
      // @todo: add other supported sort-object options.
    }

    return _.extend(defaultOptions, options);
  }

  /**
   * Process source file.
   *
   * @param {string} source - source file
   * @returns {string} resolved source file path
   */
  function processSource(source) {
    var sourceFile = util.resolveFile(source);

    if (!sourceFile) {
      throw new Error('Source file not defined or it does not exist.');
    }
    return sourceFile;
  }

  /**
   * Process destination file(s).
   *
   * @param {string|Array} destination - destination file or an array of
   * destination files
   * @returns {Array} an array of resolved destination file paths
   */
  function processDestination(destination) {
    var destinations = [];

    if (_.isArray(destination)) {
      destinations = destination;
    }
    if (_.isString(destination)) {
      destinations.push(destination);
    }
    if (!destinations.length) {
      throw new Error('Destination file not defined.');
    }
    return destinations.map(util.resolveEnsureFile);
  }

  /**
   * Adds line(s) for report.
   *
   * @param {Array} files - an array of files that were handled by Camelton
   * @param {string} category - statistics category
   * @param {string} type - log type: one of `info`, `success`, `warning`, or
   * `error`.
   * @returns {string}
   */
  this.reportAddLine = function(files, category, type) {
    var filesCount = files.length,
        output = [];

    category = category || '';
    type = type || 'info';

    if (filesCount > 0) {
      output.push('\n' + logSymbols[type] + ' ' + category + ': ' + filesCount +
      (filesCount === 1 ? ' file.' : ' files.'));

      if (_this.options.verbose) {
        output.push('\n  ' + files.join('\n'));
      }
    }

    return output.join('');
  };

  this.options = parseOptions(options);
  this.sourceFile = processSource(source);
  this.destinationFiles = processDestination(destination);

  this.statistics = {
    modified: [],
    rejected: []
  };
}

/**
 * Run the program.
 */
Camelton.prototype.run = function() {
  var _this = this,
      sourceObject;

  sourceObject = fse.readJSONSync(_this.sourceFile, {throws: false});
  if (!sourceObject) {
    throw new Error('Source file not valid JSON.');
  }

  _this.destinationFiles.forEach(function(filePath) {
    var destinationObject,
        destinationFileContents;

    destinationObject = fse.readJSONSync(filePath, {throws: false});
    // Destination file is empty or not valid JSON.
    if (!destinationObject) {
      destinationFileContents = fs.readFileSync(filePath, 'utf8');
      // Destination file is not empty but is not valid JSON -> reject it.
      if (destinationFileContents) {
        _this.statistics.rejected.push(filePath);
        return false;
      }
      // Destination file is empty.
      destinationObject = {};
    }

    // Merge schemas.
    destinationObject = obs.mergeObjectSchema(destinationObject, sourceObject);

    // Sort schema.
    if (_this.options.sortObjOptions) {
      destinationObject = obs.sortObjectSchema(destinationObject, _this.options.sortObjOptions);
    }

    // Store schema.
    fse.writeJSONSync(filePath, destinationObject);
    _this.statistics.modified.push(filePath);
  });

  return this;
};

/**
 * Reporter for CLI.
 */
Camelton.prototype.report = function() {
  var message = [];

  message.push(this.reportAddLine(this.statistics.modified, 'Modified', 'success'));
  message.push(this.reportAddLine(this.statistics.rejected, 'Rejected', 'warning'));

  console.log(message.join(''));
};

module.exports = Camelton;
