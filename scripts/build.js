#!/usr/bin/env node

'use strict';

const babel    = require('babel-core');
const bluebird = require('bluebird');
const webpack  = require('webpack');
const fs       = require('fs');
const path     = require('path');
const config   = require('../webpack/production.config.js');
const glob     = bluebird.promisify(require('glob'));
const mkdirp   = bluebird.promisify(require('mkdirp'));
const compiler = webpack(config);

const promisify = bluebird.promisify;
const coroutine = bluebird.coroutine;

const pack          = promisify(compiler.run, { context: compiler });
const writeFile     = promisify(fs.writeFile);
const transformFile = promisify(babel.transformFile);

const babelOpts = {
  presets: ['react', 'es2015', 'stage-2'],
  plugins: ['transform-inline-environment-variables'],
};

coroutine(function* () {
  yield* [
    pack(),
    coroutine(babelify)(),
  ];
})();

function* babelify() {
  const files = yield glob('./{server,shared}/**/*.js');

  process.env.NODE_ENV = 'production';

  yield bluebird.map(files, coroutine(transform));
}

function* transform(file) {
  const result  = yield transformFile(file, babelOpts);
  const newPath = `./build/${file}`;
  const dirname = path.dirname(newPath);

  yield mkdirp(dirname);
  yield writeFile(newPath, result.code);
}
