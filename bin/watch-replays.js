#!/usr/bin/env node
'use strict';
var fs            = require('fs');
var config        = require('../lib/config');
var replaysDir    = config.replaysDir;
var replayWatcher = require('../lib/replay-watcher');

// Watch for replay gifs
fs.exists(replaysDir, function(exists) {
    if (! exists) {
        fs.mkdirSync(replaysDir);
    }

    replayWatcher.watchForReplays();
    console.log('Watching for replays');
});