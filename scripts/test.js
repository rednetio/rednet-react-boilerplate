#!/usr/bin/env node

'use strict';

require('babel-register');
require('babel-polyfill');

const Mocha    = require('mocha');
const bluebird = require('bluebird');
const glob     = require('glob');
const chai     = require('chai');

// Monkey-patch Mocha to accept generators for tests
Mocha.Runnable.prototype._run = Mocha.Runnable.prototype.run;
Mocha.Runnable.prototype.run = function (fn) {
  if (this.fn.constructor.name === 'GeneratorFunction') {
    this.fn = bluebird.coroutine(this.fn);
  }

  return this._run(fn);
};

// Setup global vars
global.expect    = chai.expect;
global.promisify = bluebird.promisify;
global.coroutine = bluebird.coroutine;

// Run tests
bluebird.coroutine(function* () {
  const mocha = new Mocha();
  const tests = yield bluebird.promisify(glob)('./tests/**/*.js');

  tests.forEach(test => mocha.addFile(test));

  try {
    yield bluebird.promisify(mocha.run, { context: mocha })();
  } catch (failures) {
    process.exit(failures.message);
  }
})();
