'use strict';
var config      = require('towerfall-stats').config;
var slackPoster = require('./slack-poster');
var watch       = require('chokidar').watch;

var ReplayWatcher = function() {
    this.replayStarted = false;
};

ReplayWatcher.prototype.watchForReplays = function()
{
    var watcher = watch(config.replaysDir, {
        ignored : function(path, stats) {
            // Don't ignore the replay dir path itself
            if (path === config.replaysDir) {
                return false;
            }
            return ! /replay\d+\.gif$/.test(path);
        },
        ignoreInitial    : true,
        persistent       : true,
        awaitWriteFinish : true
    });

    watcher.on('add', function(path) {
        slackPoster.postReplay(path);
    });
};

module.exports = new ReplayWatcher();
