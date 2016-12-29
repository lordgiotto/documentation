'use strict';

var test = require('tap').test,
  path = require('path'),
  _ = require('lodash'),
  mergeConfig = require('../../lib/merge_config');

test('nc(mergeConfig', function (t) {

  // Omit configuration from output, for simplicity
  var nc = _.curryRight(_.omit, 2)('config');

  t.throws(function () {
    nc(mergeConfig({ config: 'DOES-NOT-EXIST' }));
  });

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config.json') })),
    { foo: 'bar' });

  t.deepEqual(nc(mergeConfig({ passThrough: true, config: path.join(__dirname, '../config_fixture/config.json') })),
    { foo: 'bar', passThrough: true });

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config_comments.json') })),
    { foo: 'bar' }, 'config with comments');

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config.yaml') })),
    { foo: 'bar' }, 'config.yaml');

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config.yml') })),
    { foo: 'bar' }, 'config.yml');

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config') })),
    { foo: 'bar' }, 'config in yaml without extension');

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config_links.yml') })),
    { foo: 'hello [link](https://github.com/my/link) world' }, 'config with markdown link');

  t.deepEqual(nc(mergeConfig({ config: path.join(__dirname, '../config_fixture/config_file.yml') })), {
    toc: [{
      name: 'snowflake',
      file: path.join(__dirname, '../fixture/snowflake.md')
    }]
  }, 'config with file reference');

  t.end();
});
