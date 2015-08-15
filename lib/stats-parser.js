var colors = require('./colors');

var StatsParser = function() {};

StatsParser.prototype.compileFromRawData = function(data) {
    var overallStats = {
        matches : 0,
        rounds  : 0
    };

    var perPlayerStats = {
        wins   : {},
        kills  : {},
        deaths : {},
        ratio  : {}
    };

    overallStats.matches = data.SaveData.Stats[0].MatchesPlayed[0];
    overallStats.rounds  = data.SaveData.Stats[0].RoundsPlayed[0];

    colors.forEach(function (color, index) {
        var keyName, kills, deaths, wins;

        keyName = color.charAt(0).toUpperCase() + color.substr(1);

        wins   = data.SaveData.Stats[0].Wins[0].unsignedLong;
        kills  = data.SaveData.Stats[0].Kills[0];
        deaths = data.SaveData.Stats[0].Deaths[0];

        perPlayerStats.wins[color]   = wins[index];
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
            wins   : newStats.perPlayerStats.wins[color] - oldStats.perPlayerStats.wins[color],
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