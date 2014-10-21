'use strict';

var fs = require('fs'),
    fse = require('fs-extra'),
    _ = require('underscore'),
    util = require('./lib/util.js'),
    obs = require('./lib/obs.js');

/**
 * Main program.
 *
 * @param {string} source - source file
 * @param {object} opts - options object
 */
function camelton(source, opts) {
  var defaultOptions = {
        destinations: []
      },
      options = _.extend(defaultOptions, opts),

      sourceFile = '',
      paths = [],

      sourceObject = {};

  sourceFile = util.resolveFile(source);
  if (!sourceFile) {
    throw new Error('Source file not defined or it does not exist.');
  }
  sourceObject = fse.readJSONSync(sourceFile, {throws: false});
  if (!sourceObject) {
    throw new Error('Source file not valid JSON.');
  }

  if (options.destinations && options.destinations.length) {
    paths = options.destinations.map(util.resolveEnsureFile);

    paths.forEach(function(filePath) {
      var destinationObject,
          destinationFileContents;

      destinationObject = fse.readJSONSync(filePath, {throws: false});
      // Destination file is empty or not valid JSON.
      if (!destinationObject) {
        destinationFileContents = fs.readFileSync(filePath, 'utf-8');
        // Destination file is not empty but is not valid JSON -> discard it.
        if (destinationFileContents) {
          util.log('File %s not valid JSON.', filePath);
          return false;
        }
        // Destination file is empty.
        else {
          destinationObject = {};
        }
      }

      // Destination schema is not empty and does not equal with source schema
      // -> merge schemas.
      if (!obs.isEqualObjectSchema(sourceObject, destinationObject)) {
        destinationObject = obs.mergeObjectSchema(sourceObject, destinationObject);
        util.log('File %s updated.', filePath);
      }

      fse.writeJSONSync(filePath, destinationObject);
    });
  }

  process.exit(0);
}

module.exports = camelton;
