'use strict';
var fs            = require('fs');
var https         = require('https');
var pad           = require('pad');
var querystring   = require('querystring');
var config        = require('towerfall-stats').config;
var fetch         = require('node-fetch');
var slackClient   = require('./slack-client');

var SlackPoster = function() {};

const defaultPostOptions = {
    token       : config.slackApiKey,
    username    : config.botName,
    as_user     : !config.postAsBot,
    icon_emoji  : config.botEmoji,
    channel     : config.channelId
};

const makeRequest = (method, payload) => {
    return fetch(
        `https://slack.com/api/${method}`,
        {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Content-Length': payload.length
            },
            body: payload
        }
    );
};

SlackPoster.prototype.postReplay = async function(file, callback) {
    callback = callback || function() {};

    await slackClient.files.upload({
        channels: config.channelId,
        file: fs.createReadStream(file)
    });

    callback();
};

SlackPoster.prototype.postStats = async function(stats, headingText) {
    var postData;

    headingText = headingText || 'Session Stats';

    postData = querystring.stringify(Object.assign({}, defaultPostOptions, {
        text: headingText,
        attachments: JSON.stringify(this.getStatsAttachments(stats))
    }));

    await makeRequest('chat.postMessage', postData);

    var table = '```' + stats.table + '```';

    await makeRequest(
        'chat.postMessage',
        querystring.stringify(Object.assign({}, defaultPostOptions, {
            text: table,
        }))
    );

    if (stats.miscTable) {
      var miscTable = '```' + stats.miscTable + '```';

        await makeRequest(
            'chat.postMessage',
            querystring.stringify(Object.assign({}, defaultPostOptions, {
                text: miscTable,
            }))
        );
    }
};

SlackPoster.prototype.getStatsAttachments = function(stats) {
    var fallbackText = 'TF Stats';

    var overallStatsAttachment = {
        fallback : fallbackText,
        fields   : []
    };

    overallStatsAttachment.fields.push({
        title   : 'Matches',
        value   : stats.matches.toString(),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Rounds',
        value   : stats.rounds.toString(),
        'short' : true
    });

    var rankings = stats.rankings;

    overallStatsAttachment.fields.push({
        title   : 'Most Wins',
        value   : rankings.wins[0].join(', '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Most Kills',
        value   : rankings.kills[0].join(', '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Most Deaths',
        value   : rankings.deaths[0].join(', '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Best KDR',
        value   : rankings.kdr[0].join(', '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Best Win Rate',
        value   : rankings.rate[0].join(', '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Longest Winning Streak',
        value   : rankings.streaks[0].join(', '),
        'short' : true
    });

    var attachments = [];
    attachments.push(overallStatsAttachment);

    return attachments;
};

module.exports = new SlackPoster();
