'use strict';
var colors = require('./colors');
var sortBy = require('lodash.sortby');

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
        kdr    : {}
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
        perPlayerStats.kdr[color]    = kills[keyName][0] / Math.max(deaths[keyName][0], 1);
    });

    return {
        overallStats   : overallStats,
        perPlayerStats : perPlayerStats
    };
};

StatsParser.prototype.getStatsDiff = function(newStats, oldStats) {
    var diff = {overallStats : {}, perPlayerStats : {}}, rankCalc, wins = {}, kills, deaths, kdr;

    diff.overallStats.matches = newStats.overallStats.matches - oldStats.overallStats.matches;
    diff.overallStats.rounds = newStats.overallStats.rounds - oldStats.overallStats.rounds;

    rankCalc = {wins : {}, kills : {}, deaths : {}, kdr : {}};

    colors.forEach(function (color) {
        wins   = newStats.perPlayerStats.wins[color] - oldStats.perPlayerStats.wins[color];
        kills  = newStats.perPlayerStats.kills[color] - oldStats.perPlayerStats.kills[color];
        deaths = newStats.perPlayerStats.deaths[color] - oldStats.perPlayerStats.deaths[color];
        kdr    = (kills / Math.max(deaths, 1)).toFixed(2);

        // Exclude if archer had no kills or deaths
        if (kills === 0 && deaths === 0) {
            return;
        }

        diff.perPlayerStats[color] = {
            wins   : wins,
            kills  : kills,
            deaths : deaths,
            kdr    : kdr
        };

        rankCalc.wins[wins] = rankCalc.wins[wins] ? rankCalc.wins[wins].concat(color) : [color];
        rankCalc.kills[kills] = rankCalc.kills[kills] ? rankCalc.kills[kills].concat(color) : [color];
        rankCalc.deaths[deaths] = rankCalc.deaths[deaths] ? rankCalc.deaths[deaths].concat(color) : [color];
        rankCalc.kdr[kdr] = rankCalc.kdr[kdr] ? rankCalc.kdr[kdr].concat(color) : [color];
    });

    diff.ranks = {
        wins   : sortBy(rankCalc.wins, function(v, k) {return k * -1;}),
        kills  : sortBy(rankCalc.kills, function(v, k) {return k * -1;}),
        deaths : sortBy(rankCalc.deaths, function(v, k) {return k * -1;}),
        kdr    : sortBy(rankCalc.kdr, function(v, k) {return k * -1;})
    };

    return diff;
};

module.exports = new StatsParser();