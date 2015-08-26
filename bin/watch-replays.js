#!/usr/bin/env node
'use strict';
var fs          = require('fs');
var config      = require('../lib/config');
var replaysDir  = config.replaysDir;
var fileHandler = require('../lib/file-handler');

// Watch for replay gifs
fs.exists(replaysDir, function(exists) {
    if (! exists) {
        fs.mkdirSync(replaysDir);
    }

    fileHandler.watchForReplays();
});
