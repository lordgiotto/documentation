'use strict';

var path = require('path');
var mergeConfig = require('../merge_config');

/**
 * Formats documentation as HTML.
 *
 * @param {Array<Object>} comments parsed comments
 * @param {Object} args Options that can customize the output
 * @param {string} [args.theme='default_theme'] Name of a module used for an HTML theme.
 * @returns {Promise} Promise with results
 * @name formats.html
 * @public
 * @example
 * var documentation = require('documentation');
 * var streamArray = require('stream-array');
 * var vfs = require('vinyl-fs');
 *
 * documentation.build(['index.js'])
 *   .then(documentation.formats.html)
 *   .then(output => {
 *     streamArray(output).pipe(vfs.dest('./output-directory'));
 *   });
 */
module.exports = function html(comments, args) {
  var options = mergeConfig(args);
  var themePath = '../../default_theme/';
  if (options.theme) {
    themePath = path.resolve(process.cwd(), options.theme);
  }
  return require(themePath)(comments, options);
};
