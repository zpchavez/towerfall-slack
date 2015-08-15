#!/usr/bin/env node
var fs          = require('fs');
var fileHandler = require('../lib/file-handler');
var config      = require('../config');

var statSnapshot = config.statSnapshot;

fs.exists(statSnapshot, function(exists) {
    if (! exists) {
        fileHandler.createSnapshotFile();
        console.log('First time executing. Stats will be compiled next time.');
    } else {
        fileHandler.compileAndPostStats();
    }
});
