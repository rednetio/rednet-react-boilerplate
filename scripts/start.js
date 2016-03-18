#!/usr/bin/env node

'use strict';

const app = require('../build/server').default;

app.listen(3000);
