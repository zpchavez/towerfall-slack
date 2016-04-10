'use strict';
var fs            = require('fs');
var https         = require('https');
var pad           = require('pad');
var querystring   = require('querystring');
var SlackUploader = require('node-slack-upload');
var config        = require('towerfall-stats').config;
var fetch         = require('node-fetch');

var slackUploader = new SlackUploader(config.slackApiKey);

var SlackPoster = function() {};

SlackPoster.prototype.postReplay = function(file, callback) {
    callback = callback || function() {};

    slackUploader.uploadFile(
        {
            file     : fs.createReadStream(file),
            channels : config.channelId
        },
        function(err) {
            if (err) {
                console.log('Error uploading: ' + file);
                console.log(err);
                return;
            }
            callback();
        }
    );
};

SlackPoster.prototype.postStats = function(stats, headingText) {
    var postData, request, options;

    headingText = headingText || 'Session Stats';

    postData = querystring.stringify({
        token       : config.slackApiKey,
        text        : headingText,
        attachments : JSON.stringify(this.getStatsAttachments(stats)),
        username    : config.botName,
        as_user     : !config.postAsBot,
        icon_emoji  : config.botEmoji,
        channel     : config.channelId
    });

    return fetch(
        'https://slack.com/api/chat.postMessage',
        {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Content-Length': postData.length
            },
            body: postData
        }
    );
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

    var table = '```' + stats.table + '```';

    attachments.push({
        fallback  : fallbackText,
        text      : table,
        mrkdwn_in : ['text']
    });

    return attachments;
};

module.exports = new SlackPoster();
