#!/usr/bin/env node
'use strict';
var fileHandler = require('towerfall-stats').fileHandler;

var append = ['-a', '--append'].indexOf(process.argv[2]) !== -1;

console.log('Watching for stat updates');
fileHandler.watchForUpdates(append);
