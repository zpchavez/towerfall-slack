var colors = require('./colors');

var StatsParser = function() {};

StatsParser.prototype.compileFromRawData = function(data) {
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

StatsParser.prototype.getStatsDiff = function(newStats, oldStats) {
    var diff = {overallStats : {}, perPlayerStats : {}};

    diff.overallStats.matches = newStats.overallStats.matches - oldStats.overallStats.matches;
    diff.overallStats.rounds = newStats.overallStats.rounds - oldStats.overallStats.rounds;

    colors.forEach(function (color) {
        diff.perPlayerStats[color] = {
            kills  : newStats.perPlayerStats.kills[color] - oldStats.perPlayerStats.kills[color],
            deaths : newStats.perPlayerStats.deaths[color] - oldStats.perPlayerStats.deaths[color],
        };
        diff.perPlayerStats[color].ratio = (
            diff.perPlayerStats[color].kills / Math.max(diff.perPlayerStats[color].deaths, 1)
        ).toFixed(2);
    });

    return diff;
};

module.exports = new StatsParser();