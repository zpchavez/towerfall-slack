var fs     = require('fs');
var xml2js = require('xml2js');
var config = require('./config');

var tfDataFile   = config.tfDataFile;
var statSnapshot = config.statSnapshot;
var parser       = new xml2js.Parser({async : false});

var colors = [
    'green',
    'blue',
    'pink',
    'orange',
    'white',
    'yellow',
    'cyan',
    'purple',
    'red',
];

var compileStatsFromRawData = function(data) {
    var overallStats = {
        matches : 0,
        rounds  : 0
    };

    var perPlayerStats = {
        kills  : {},
        deaths : {},
        ratio  : {}
    };

    overallStats.matches = data.SaveData.Stats[0].MatchesPlayed[0];
    overallStats.rounds  = data.SaveData.Stats[0].RoundsPlayed[0];

    colors.forEach(function (color) {
        var keyName, kills, deaths;

        keyName = color.charAt(0).toUpperCase() + color.substr(1);

        kills  = data.SaveData.Stats[0].Kills[0];
        deaths = data.SaveData.Stats[0].Deaths[0];

        perPlayerStats.kills[color]  = kills[keyName][0];
        perPlayerStats.deaths[color] = deaths[keyName][0];
        perPlayerStats.ratio[color]  = kills[keyName][0] / Math.max(deaths[keyName][0], 1);
    });

    return {
        overallStats   : overallStats,
        perPlayerStats : perPlayerStats
    };
};

var createInitialFile = function(callback) {
    fs.readFile(tfDataFile, function(err, data) {
        parser.parseString(data, function(err, result) {
            var stats = compileStatsFromRawData(result);
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

var getRawStatsSync = function()
{
    var rawData, stats;

    rawData = fs.readFileSync(tfDataFile);

    parser.parseString(rawData, function(err, result) {
        if (err) {
            throw err;
        }
        stats = compileStatsFromRawData(result);
    });

    return stats;
};

var getPreviousStatsSync = function()
{
    var rawData, stats;

    rawData = fs.readFileSync(statSnapshot);

    stats = JSON.parse(rawData);

    return stats;
};

var broadcastStatsDiff = function(newStats, oldStats)
{
    var diff = {overallStats : {}, perPlayerStats : {}};

    diff.overallStats.matches = newStats.overallStats.matches - oldStats.overallStats.matches;
    diff.overallStats.rounds = newStats.overallStats.rounds - oldStats.overallStats.rounds;

    colors.forEach(function (color) {
        diff.perPlayerStats[color] = {
            kills  : newStats.perPlayerStats.kills[color] - oldStats.perPlayerStats.kills[color],
            deaths : newStats.perPlayerStats.deaths[color] - oldStats.perPlayerStats.deaths[color],
        };
        diff.perPlayerStats[color].ratio = diff.perPlayerStats[color].kills / Math.max(diff.perPlayerStats[color].deaths, 1);
    });

    console.log(diff);

    return diff;
};

var watchSaveDataFile = function() {
    console.log('Watching TowerFall data file!');
    fs.watchFile(tfDataFile, function (current, previous) {
        var rawStats, snapshot;

        rawStats = getRawStatsSync();
        snapshot = getPreviousStatsSync();

        broadcastStatsDiff(rawStats, snapshot);

        fs.writeFile(statSnapshot, JSON.stringify(rawStats), function (err) {
            if (err) {
                throw err;
            }
        });
    });
};

fs.exists(statSnapshot, function(exists) {
    if (! exists) {
        createInitialFile(watchSaveDataFile);
    } else {
        watchSaveDataFile();
    }
});
