#!/usr/bin/env node
'use strict';

var path = require('path'),
    util = require('../lib/util.js'),
    camelton = require('../index.js');

/**
 * Command line program.
 */
module.exports = function(program) {
  var source = program.args[0] ? path.resolve(program.args[0]) : null,
      destinations = program.args[1] ? Array.prototype.slice.call(program.args, 1) : [],
      options = {},
      output;

  if (!source) {
    console.error('Input file not defined.');
    program.help();
  }

  options.destinations = destinations;

  try {
    output = camelton(source, options);
  }
  catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};
