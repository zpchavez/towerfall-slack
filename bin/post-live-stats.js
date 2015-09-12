#!/usr/bin/env node
'use strict';
var fs          = require('fs');
var fileHandler = require('towerfall-stats').fileHandler;
var slackPoster = require('../lib/slack-poster');
var config      = require('towerfall-stats').config;

var liveStatsFile = config.liveStatsFile;

fs.exists(liveStatsFile, function(exists) {
    if (! exists) {
        console.log('Live stats file not found. Run watch-stats and play a match to create it.');
    } else {
        var stats = fileHandler.getCompiledLiveStats();

        slackPoster.postStats(stats, function() {
            console.log('Stats posted');
            // Delete file so we don't accidentally post it again when there
            // have been no changes.
            fs.unlink(liveStatsFile);
        });
    }
});
