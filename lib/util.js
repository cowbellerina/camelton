'use strict';

var path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    util;

util = {
  /**
   * Logs messages through console.log().
   *
   * Usage examples:
   * log("Hello, World!");
   *
   * var str = "World";
   * log("Hello, %s!", str);
   *
   * @param {string} message
   */
  log: function(message) {
    var args = Array.prototype.slice.call(arguments, 1);
    console.log(message, args);
  },

  /**
   * Resolves file path.
   *
   * @param {string} file - File path.
   * @returns {string|boolean} Resolved file path, or false if path does not
   * exist.
   */
  resolveFile: function(file) {
    var filePath = path.resolve(file);

    if (filePath && fs.existsSync(filePath)) {
      return filePath;
    }

    return false;
  },

  /**
   * Resolves file path, and ensures the file exist.
   *
   * @param {string} file - File path.
   * @returns {string|boolean} Resolved file path, or false if path cannot be
   * created.
   */
  resolveEnsureFile: function(file) {
    var filePath = path.resolve(file);

    if (filePath) {
      if (!fs.existsSync(filePath)) {
        fse.ensureFileSync(filePath);
      }
      return filePath;
    }

    return false;
  }
};

module.exports = util;
