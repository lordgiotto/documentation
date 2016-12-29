'use strict';

var walk = require('../walk');

/**
 * Formats documentation as a JSON string.
 *
 * @param {Array<Object>} comments parsed comments
 * @param {Object} opts Options that can customize the output
 * @name formats.json
 * @return {Promise} promise with eventual value
 * @public
 * @example
 * var documentation = require('documentation');
 * var fs = require('fs');
 *
 * documentation.build(['index.js'])
 *   .then(documentation.formats.json)
 *   .then(output => {
 *     // output is a string of JSON data
 *     fs.writeFileSync('./output.json', output);
 *   });
 */
module.exports = function (comments) {

  walk(comments, comment => {
    delete comment.errors;
    if (comment.context) {
      delete comment.context.sortKey;
    }
  });

  return Promise.resolve(JSON.stringify(comments, null, 2));
};
