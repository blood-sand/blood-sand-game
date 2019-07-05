// Webpack - Configuration (Production)
'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
  },
  plugins: [
    // Manifest
    new ManifestPlugin(),
    // Optimization - CSS
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
    // Images
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: ('img'),
      optipng: {
        optimizationLevel: 9,
      },
      gifsicle: {
        optimizationLevel: 9,
      },
    }),
    // Banner
    new webpack.BannerPlugin({
      banner: ' version 0.1.0 - © Blood & Sand 2019. All Rights reserved. https://www.develteam.com/Game/Blood-and-Sand - Released under license apache-2.0',
      raw: false,
      entryOnly: true,
    }),
  ]
});
