#!/usr/bin/env node

'use strict';

require('babel-register');
require('babel-polyfill');

if (process.env.NODE_ENV === 'production') {
  console.error('THIS SCRIPT IS NOT SUITED FOR PRODUCTION.');
  process.exit(1);
}

const bluebird = require('bluebird');
const webpack  = require('webpack');
const dev      = require('webpack-dev-middleware');
const hot      = require('webpack-hot-middleware');
const app      = require('../server').default;
const config   = require('../webpack/development.config.js');

const compiler   = webpack(config);
const hotPromise = bluebird.promisify(hot(compiler));
const devPromise = bluebird.promisify(dev(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
}));

app.use(function* (next) {
  // We need to monkey-patch this.res to set the statusCode explicitly, which
  // Express (the supported platform - we use Koa) doesn't need.
  yield devPromise(this.req, Object.assign(this.res, { send }));
  yield hotPromise(this.req, this.res);
  yield next;
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

function send(body) {
  // `this` is the Node response (http.ServerResponse) object
  this.statusCode = 200;

  // We bypass Koa's middleware system by ending the response. This should NEVER
  // be done in production, don't even think about it Seb ;)
  this.end(body);
}
