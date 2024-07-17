'use strict';

const { merge } = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    contentScript: PATHS.src + '/contentScript.js',
    background: PATHS.src + '/background.js',
  },
  // resolve: {
  //   symlinks: false,
  //   modules: [
  //     'node_modules',
  //     path.resolve(__dirname, '..', '..', '..', 'bringweb3-sdk'),
  //   ],
  //   alias: {
  //     '/utils': path.resolve(__dirname, '..', '..', '..', 'bringweb3-sdk', 'utils'),
  //   }
  // },
  watchOptions: {
    ignored: /node_modules\/(?!bringweb3-sdk)/,
  },
});

module.exports = config;
