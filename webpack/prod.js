// Webpack - Configuration (Production)
'use strict';

const merge = require('webpack-merge');
const path = require('path');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

// Module Exports
module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'bundle.min.js'
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
