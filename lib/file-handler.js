var config      = require('../config');
var fs          = require('fs');
var slackPoster = require('./slack-poster');
var statsParser = require('./stats-parser');
var xml2js      = require('xml2js');

var tfDataFile   = config.tfDataFile;
var statSnapshot = config.statSnapshot;
var parser       = new xml2js.Parser({async : false});

var FileHandler = function() {};

FileHandler.prototype.createSnapshotFile = function(callback) {
    fs.readFile(tfDataFile, function(err, data) {
        parser.parseString(data, function(err, result) {
            var stats = statsParser.compileFromRawData(result);
            fs.writeFile(statSnapshot, JSON.stringify(stats), function (err) {
                if (err) {
                    throw err;
                } else {
                    callback();
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

FileHandler.prototype.watchSaveDataFile = function(callback)
{
    var fileHandler = this;

    console.log('Watching for TowerFall activity!');
    fs.watchFile(tfDataFile, function (current, previous) {
        var rawStats, snapshot, statsDiff;

        rawStats = fileHandler.getRawStatsSync();
        snapshot = fileHandler.getPreviousStatsSync();

        statsDiff = statsParser.getStatsDiff(rawStats, snapshot);

        console.log(statsDiff);

        // Update snapshot file
        fs.writeFile(statSnapshot, JSON.stringify(rawStats), function (err) {
            if (err) {
                throw err;
            }
        });
    });
};

FileHandler.prototype.watchForReplays = function()
{
    fs.watch(config.replaysDir, function(event, filename) {
        var fullPath = config.replaysDir + '/' + filename;

        // Only post gifs that have generated completely
        if (/^replay\d+\.gif$/.test(filename) && event === 'change') {
            slackPoster.postReplay(fullPath);
        }
    });
};

module.exports = new FileHandler();