'use strict';
var config      = require('./config');
var fs          = require('fs');
var slackPoster = require('./slack-poster');

var ReplayWatcher = function() {
    this.replayStarted = false;
};

ReplayWatcher.prototype.watchForReplays = function()
{
    var self = this;

    fs.watch(config.replaysDir, function(event, filename) {
        var fullPath = config.replaysDir + '/' + filename;

        if (/^replay\d+\.gif$/.test(filename)) {
            var fileExists = fs.existsSync(fullPath);
            // When the file is first created, it is incomplete.
            if (! self.replayStarted && fileExists) {
                self.replayStarted = true;
            } else {
                self.replayStarted = false;
                // Replay may have been canceled, so make sure file exists.
                if (fileExists) {
                    slackPoster.postReplay(fullPath);
                }
            }

        }
    });
};

module.exports = new ReplayWatcher();