'use strict';

/**
 * Helpers for processing objects.
 *
 * @module obs
 */

var _ = require('underscore');

/**
 * Is given variable a plain object, i.e. not a function or Array.
 *
 * @see http://underscorejs.org/#isObject
 *
 * @param {object} object
 * @returns {boolean} Result of the checks.
 */
function isObjectObject(object) {
  return _.isObject(object) && !_.isArray(object) && !_.isFunction(object);
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
 * Create an object schema - an object with keys and empty strings as values.
 *
 * @param {object} object
 * @returns {object} Object schema. An object with keys and empty strings as
 * values.
 */
function getObjectSchema(object) {
  var outputObject = {};

  if (isObjectObject(object)) {
    Object.keys(object).forEach(function(key) {
      outputObject[key] = isObjectObject(object[key]) ? getObjectSchema(object[key]) : '';
    });
  }

  return outputObject;
}

/**
 * Merge one of more objects schemas together. Original object properties and
 * values are preserved.
 *
 * @param {object} object
 * @returns {object} Extended object schema.
 */
function mergeObjectSchema(object) {
  var source, length, i;

  if (!isObjectObject(object)) { return object; }

  for (i = 1, length = arguments.length; i < length; i++) {
    source = getObjectSchema(arguments[i]);
    object = _.extend(source, object);
  }

  return object;
}

module.exports.getObjectSchema = getObjectSchema;
module.exports.isEqualObjectSchema = isEqualObjectSchema;
module.exports.mergeObjectSchema = mergeObjectSchema;
