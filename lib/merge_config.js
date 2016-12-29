'use strict';

var yaml = require('js-yaml'),
  fs = require('fs'),
  path = require('path'),
  stripComments = require('strip-json-comments');

function processToc(config, absFilePath) {
  if (!config || !config.toc) {
    return config;
  }

  config.toc = config.toc.map(entry => {
    if (entry && entry.file) {
      entry.file = path.join(
        path.dirname(absFilePath),
        entry.file
      );
    }

    return entry;
  });

  return config;
}

/**
 * Merge a configuration file into program options, assuming that the location
 * of the configuration file is given as one of those options.
 *
 * @param {Objects} options the user-provided options, usually via argv
 * @returns {Object} configuration, if it can be parsed
 * @throws {Error} if the file cannot be read.
 */
function mergeConfig(options) {
  if (options && typeof options.config === 'string') {
    var filePath = options.config;
    var ext = path.extname(filePath);
    var absFilePath = path.resolve(process.cwd(), filePath);
    var rawFile = fs.readFileSync(absFilePath, 'utf8');

    try {
      if (ext === '.json') {
        return Object.assign({}, options, processToc(JSON.parse(stripComments(rawFile))));
      }

      return Object.assign({}, options, processToc(yaml.safeLoad(rawFile), absFilePath));
    } catch (e) {
      e.message = `Cannot read config file: ${filePath}
  Error: ${e.message}`;
      throw e;
    }

  } else {
    return options || {};
  }
}

module.exports = mergeConfig;
