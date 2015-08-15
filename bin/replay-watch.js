#!/usr/bin/env node
var fs     = require('fs');
var xml2js = require('xml2js');
var config = require('../config');

var tfDataFile   = config.tfDataFile;
var statSnapshot = config.statSnapshot;
var replaysDir   = config.replaysDir;
var parser       = new xml2js.Parser({async : false});

var fileHandler = require('../lib/file-handler');

// Watch for replay gifs
fs.exists(replaysDir, function(exists) {
    if (! exists) {
        fs.mkdirSync(replaysDir);
    }

    fileHandler.watchForReplays();
});
