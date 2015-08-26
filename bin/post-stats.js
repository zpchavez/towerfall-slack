#!/usr/bin/env node
'use strict';
var fs          = require('fs');
var fileHandler = require('towerfall-stats').fileHandler;
var slackPoster = require('../lib/slack-poster');
var config      = require('../lib/config');

var statSnapshot = config.statSnapshot;

fs.exists(statSnapshot, function(exists) {
    if (! exists) {
        fileHandler.createSnapshotFile();
        console.log('First time executing. Stats will be compiled next time.');
    } else {
        var stats = fileHandler.compileSessionStats();

        if (stats) {
            slackPoster.postStats(stats, function() {
                console.log('Stats posted');
                fileHandler.updateSnapshotFile();
            });
        } else {
            console.log('No changes');
        }
    }
});
