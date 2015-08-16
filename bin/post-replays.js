#!/usr/bin/env node
var config      = require('../config');
var fs          = require('fs');
var slackPoster = require('../lib/slack-poster');

var sortedReplays, replayFiles, start, end;

start = parseInt(process.argv[2], 10) || 0;
end   = parseInt(process.argv[3]) || Infinity;

if (isNaN(start) || isNaN(end)) {
    throw new Error('start and end args must be integers');
}

var postReplaysStartingFrom = function(number)
{
    var filename;

    filename = 'replay' + number + '.gif';

    if (sortedReplays.indexOf(filename) === -1) {
        console.log('done uploading');
        // No more replays to upload. Stop uploading.
        return;
    }

    if (number > end) {
        console.log('done uploading');
        // Exceeded end arg
        return;
    }

    console.log('uploading ' + filename);
    slackPoster.postReplay(
        config.replaysDir + '/' + filename,
        function() {
            // Upload the next one
            postReplaysStartingFrom(number + 1);
        }
    );
};

// Sort replays in ascending order
sortedReplays = [];
replayFiles = fs.readdirSync(config.replaysDir);
replayFiles.forEach(function (file) {
    var replayNum, regexpResult;

    regexpResult = /^replay(\d+)\.gif$/.exec(file);
    if (! regexpResult) {
        // Not a replay file
        return;
    }

    replayNum = regexpResult[1];
    sortedReplays[replayNum] = file;
});

postReplaysStartingFrom(start);