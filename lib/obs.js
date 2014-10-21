'use strict';

/**
 * Helpers for processing objects.
 *
 * @module obs
 */

var _ = require('underscore');

/**
 * Create an object schema - an object with keys and empty strings as values.
 *
 * @todo: recurse only on objects, not arrays
 *
 * @param {object} object
 * @returns {object} Object schema. An object with keys and empty strings as
 * values.
 */
function getObjectSchema(object) {
  var outputObject = {};
  Object.keys(object).forEach(function(key) {
    if (_.isObject(object[key])) {
      outputObject[key] = getObjectSchema(object[key]);
    }
    else {
      outputObject[key] = '';
    }
  });

  return outputObject;
}

/**
 * Compare object schemas.
 *
 * @param {object} object1
 * @param {object} object2
 * @returns {boolean} Result of the comparison.
 */
function isEqualObjectSchema(object1, object2) {
  return _.isEqual(getObjectSchema(object1), getObjectSchema(object2));
}

/**
 * Merge object schemas.
 *
 * @todo: add custom merge instead of underscore extend
 *
 * @param {object} object1
 * @param {object} object2
 * @returns {object} Merged object schema.
 */
function mergeObjectSchema(object1, object2) {
  var outputObject = _.extend(object2, getObjectSchema(object1));
  return outputObject;
}

module.exports.getObjectSchema = getObjectSchema;
module.exports.isEqualObjectSchema = isEqualObjectSchema;
module.exports.mergeObjectSchema = mergeObjectSchema;
