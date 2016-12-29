'use strict';

var errorPage = require('../../lib/serve/error_page'),
  extend = require('extend'),
  chokidar = require('chokidar'),
  sharedOptions = require('./shared_options'),
  Server = require('../../lib/serve/server'),
  debounce = require('debounce'),
  documentation = require('../../');

module.exports.command = 'serve [input..]';
module.exports.description = 'generate, update, and display HTML documentation';
/**
 * Add yargs parsing for the serve command
 * @param {Object} yargs module instance
 * @returns {Object} yargs with options
 * @private
 */
module.exports.builder = extend(
  {},
  sharedOptions.sharedOutputOptions,
  sharedOptions.sharedInputOptions,
  {
    port: {
      describe: 'port for the local server',
      type: 'number',
      default: 4001
    }
  });

/**
 * Wrap the documentation build command along with a server, making it possible
 * to preview changes live
 * @private
 * @param {Object} argv cli input
 * @returns {undefined} has side effects
 */
module.exports.handler = function serve(argv) {
  argv._handled = true;
  var server = new Server(argv.port);
  var watcher;

  server.on('listening', function () {
    process.stdout.write(`documentation.js serving on port ${argv.port}\n`);
  });

  function updateWatcher() {
    if (!watcher) {
      watcher = chokidar.watch(argv.input);
      watcher.on('all', debounce(updateServer, 300));
    }

    documentation.expandInputs(argv.input, argv)
      .then(files => {
        watcher.add(files.map(data =>
          typeof data === 'string' ? data : data.file));
      }, err => {
        /* eslint no-console: 0 */
        return server.setFiles([errorPage(err)]).start();
      });
  }

  function updateServer() {
    documentation.build(argv.input, argv)
      .then(comments =>
        documentation.formats.html(comments, argv))
        .then(files => {
          if (argv.watch) {
            updateWatcher();
          }
          server.setFiles(files).start();
        }, err => {
          return server.setFiles([errorPage(err)]).start();
        });
  }

  updateServer();
};
