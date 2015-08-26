'use strict';
var config      = require('./config');
var fs          = require('fs');
var slackPoster = require('./slack-poster');
var statsParser = require('./stats-parser');
var xml2js      = require('xml2js');
var isEqual     = require('lodash.isequal');

var tfDataFile   = config.tfDataFile;
var statSnapshot = config.statSnapshot;
var parser       = new xml2js.Parser({async : false});

var FileHandler = function() {
    this.replayStarted = false;
};

FileHandler.prototype.createSnapshotFile = function() {
    fs.readFile(tfDataFile, function(err, data) {
        parser.parseString(data, function(err, result) {
            var stats = statsParser.compileFromRawData(result);
            fs.writeFile(statSnapshot, JSON.stringify(stats), function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    });
};

FileHandler.prototype.getRawStatsSync = function()
{
    var rawData, stats;

    rawData = fs.readFileSync(tfDataFile);

    parser.parseString(rawData, function(err, result) {
        if (err) {
            throw err;
        }
        stats = statsParser.compileFromRawData(result);
    });

    return stats;
};

FileHandler.prototype.getPreviousStatsSync = function()
{
    var rawData, stats;

    rawData = fs.readFileSync(statSnapshot);

    stats = JSON.parse(rawData);

    return stats;
};

FileHandler.prototype.compileAndPostStats = function()
{
    var rawStats, snapshot, statsDiff;

    rawStats = this.getRawStatsSync();
    snapshot = this.getPreviousStatsSync();

    if (isEqual(rawStats, snapshot)) {
        console.log('No changes');
        return;
    }

    statsDiff = statsParser.getStatsDiff(rawStats, snapshot);

    slackPoster.postStats(statsDiff);

    this.updateSnapshotFile(rawStats);
};

FileHandler.prototype.updateSnapshotFile = function(rawStats)
{
    rawStats = rawStats || this.getRawStatsSync();

    fs.writeFile(statSnapshot, JSON.stringify(rawStats), function (err) {
        if (err) {
            throw err;
        }
    });
};

FileHandler.prototype.watchForReplays = function()
{
    var self = this;

    fs.watch(config.replaysDir, function(event, filename) {
        var fullPath = config.replaysDir + '/' + filename;

        if (/^replay\d+\.gif$/.test(filename)) {
            // When the file is first created, it is incomplete.
            if (! self.replayStarted) {
                self.replayStarted = true;
            } else {
                self.replayStarted = false;
                // Replay may have been canceled, so make sure file exists.
                if (fs.existsSync(fullPath)) {
                    slackPoster.postReplay(fullPath);
                }
            }

        }
    });
};

module.exports = new FileHandler();