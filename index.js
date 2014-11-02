'use strict';

var fs = require('fs'),
    fse = require('fs-extra'),
    _ = require('underscore'),
    util = require('./lib/util.js'),
    obs = require('./lib/obs.js');

/**
 * Initialize Camelton.
 *
 * @param {string} source - source file
 * @param {string|array} destination - destination file or an array of
 * destination files
 * @param {object} options - options object
 */
function Camelton(source, destination, options) {
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
    var defaultOptions = {};
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
   * @param {string|array} destination - destination file or an array of
   * destination files
   * @returns {string} an array of resolved destination file paths
   */
  function processDestination(destination) {
    var destinations = [],
        destinationFiles = [];

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

  this.options = parseOptions(options);
  this.sourceFile = processSource(source);
  this.destinationFiles = processDestination(destination);
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
      // Destination file is not empty but is not valid JSON -> discard it.
      if (destinationFileContents) {
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
  });

  return this;
};

/**
 * Reporter for CLI.
 */
Camelton.prototype.report = function() {};

module.exports = Camelton;
