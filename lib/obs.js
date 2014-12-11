'use strict';

/**
 * Helpers for processing objects.
 *
 * @module obs
 */

var _ = require('underscore'),
    // Yes, asc <-> desc happens. That's because sort-asc and sort-desc are
    // named the opposite of what they do IMO.
    sortAsc = require('sort-desc'),
    sortDesc = require('sort-asc');

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
 * Merge object schemas together. Original object properties and
 * values are preserved.
 *
 * @todo Should this be so complicated? Maybe refactor the shit out of this?
 *
 * @param {object} object
 * @param {object} other
 * @returns {object} Merged object schema.
 */
function mergeObjectSchema(object, other) {
  var pruneExtraKeys = arguments[2] || false,
      source, sourceKeys,
      keysDiff,
      outputObject, i;

  // Don't bother doing anything with non-plain objects.
  if (!isObjectObject(object) || !isObjectObject(other)) { return object; }

  outputObject = {};

  source = getObjectSchema(other);
  sourceKeys = Object.keys(source);

  i = -1;

  while (++i < sourceKeys.length) {
    // Original object already has property.
    if (object.hasOwnProperty(sourceKeys[i])) {
      // Recurse or copy defined property.
      outputObject[sourceKeys[i]] = isObjectObject(object[sourceKeys[i]]) ?
          mergeObjectSchema(object[sourceKeys[i]], source[sourceKeys[i]], pruneExtraKeys) :
          object[sourceKeys[i]];
    }
    // Original object does not have property.
    else {
      // Recurse source property of add empty value.
      outputObject[sourceKeys[i]] = isObjectObject(source[sourceKeys[i]]) ?
          mergeObjectSchema({}, source[sourceKeys[i]], pruneExtraKeys) :
          '';
    }
  }

  // Add extra properties found in original object to the end of the object.
  if (!Boolean(pruneExtraKeys)) {
    keysDiff = _.difference(Object.keys(object), sourceKeys);
    i = -1;

    while (++i < keysDiff.length) {
      outputObject[keysDiff[i]] = object[keysDiff[i]];
    }
  }

  return outputObject;
}

/**
 * Sort object schema.
 *
 * @param {object} object
 * @param {object} options
 * @returns {object} Sorted object schema.
 */
function sortObjectSchema(object, options) {
  var sort = {asc: sortAsc, desc: sortDesc},
      keys = Object.keys(object),
      outputObject = {};

  if (options.sort) {
    keys.sort(sort[options.sort]);
  }

  keys.forEach(function(key, index) {
    if (isObjectObject(object[key])) {
      object[key] = sortObjectSchema(object[key], options);
    }
    outputObject[keys[index]] = object[keys[index]];
  });

  return outputObject;
}

module.exports.getObjectSchema = getObjectSchema;
module.exports.isEqualObjectSchema = isEqualObjectSchema;
module.exports.mergeObjectSchema = mergeObjectSchema;
module.exports.sortObjectSchema = sortObjectSchema;
