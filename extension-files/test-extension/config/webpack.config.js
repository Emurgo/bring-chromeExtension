'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');
const webpack = require('webpack');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    contentScript: PATHS.src + '/contentScript.js',
    background: PATHS.src + '/background.js',
  },
  watchOptions: {
    ignored: /node_modules\/(?!@bringweb3\/sdk)/,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'PLATFORM_IDENTIFIER': JSON.stringify(process.env.PLATFORM_IDENTIFIER),
        'IFRAME_ENDPOINT': JSON.stringify(process.env.IFRAME_ENDPOINT)
      }
    })
  ]
});

module.exports = config;
