#!/usr/bin/env node
'use strict';

/**
 * Command-line interface.
 *
 * @module cli
 */

var path = require('path'),
    Camelton = require('../index.js');

/**
 * Command-line program.
 *
 * @param {object} program - Commander program
 */
function cli(program) {
  var source = program.args[0] ? path.resolve(program.args[0]) : null,
      destinations = program.args[1] ? Array.prototype.slice.call(program.args, 1) : [],
      options = {},
      camelton;

  if (!source) {
    console.error('Source file not defined.');
    program.help();
  }

  if (!destinations.length) {
    console.error('Destination file not defined.');
    program.help();
  }

  if (program.sort) {
    options.sort = program.sort;
  }

  try {
    camelton = new Camelton(source, destinations, options);
    camelton.run();
    camelton.report();
    process.exit(0);
  }
  catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = cli;
