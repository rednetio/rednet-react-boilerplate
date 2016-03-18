'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './client',
  ],
  output: {
    path: path.join(__dirname, '..', './public/assets'),
    filename: 'client.js',
    publicPath: '/assets',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    loaders: [{
      loader: 'babel',
      include: [
        './client',
        './shared',
      ],
      test: /\.js$/,
      query: {
        presets: ['react', 'es2015', 'stage-2'],
      },
      cacheDirectory: path.join(__dirname, '..', './cache'),
    }, {
      loader: 'style!css?modules',
      include: [
        path.join(__dirname, '..', './client'),
      ],
      test: /\.css$/,
    }],
  },
};
