// Webpack - Configuration (Development)
'use strict';

// Module Imports
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'src/css/index.css',
});
const autoprefixer = require('autoprefixer');

// Module Exports
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [{
        // SASS - CSS
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, './src/css'),
          path.resolve(__dirname, './src/sass'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules/compass-mixins/lib'),
                  path.resolve(__dirname, 'src/sass'),
                ],
              },
            },
          ],
        }),
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      }, {
        // Images
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        include: path.resolve(__dirname, './src/assets/img'),
        use: [{
          loader: 'file-loader',
          options: {
            useRelativePath: true,
          },
        }],
      },
      {
        // JS
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  plugins: [
    // SASS - CSS
    extractSass,
    // Cleanings
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        './dist',
      ],
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    // HTML
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
