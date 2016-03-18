'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './client',
  ],
  output: {
    path: path.join(__dirname, '..', './public/assets'),
    filename: 'client.js',
    publicPath: '/assets',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      loader: 'babel',
      include: [
        path.join(__dirname, '..', './client'),
        path.join(__dirname, '..', './shared'),
      ],
      test: /\.js$/,
      query: {
        presets: ['react', 'es2015', 'stage-2', 'react-hmre'],
      },
      cacheDirectory: path.join(__dirname, '..', './cache'),
    }, {
      loader: 'style!css?modules&sourceMap',
      include: [
        path.join(__dirname, '..', './client'),
      ],
      test: /\.css$/,
    }],
  },
};
