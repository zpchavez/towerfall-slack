var fs             = require('fs');
var https          = require('https');
var pad            = require('pad');
var querystring    = require('querystring');
var SlackUploader  = require('node-slack-upload');

var colors        = require('./colors');
var config        = require('../config');
var slackUploader = new SlackUploader(config.slackApiKey);

var SlackPoster = function() {};

var fallbackText = 'TF Stats';

SlackPoster.prototype.postReplay = function(file, callback) {
    callback = callback || function() {};

    slackUploader.uploadFile(
        {
            file     : fs.createReadStream(file),
            channels : config.channelId
        },
        function(err) {
            if (err) {
                throw err;
            }
            callback();
        }
    );
};

SlackPoster.prototype.getStatsAttachments = function(stats) {
    var attachments = [],
        overallStatsAttachment,
        padSize = 5,
        statsPerLine = 3,
        counter = 0,
        statLine = '';

    overallStatsAttachment = {
        fallback : fallbackText,
        fields   : []
    };

    overallStatsAttachment.fields.push({
        title : 'Matches',
        value : stats.overallStats.matches,
        short : true
    });

    overallStatsAttachment.fields.push({
        title : 'Rounds',
        value : stats.overallStats.rounds,
        short : true
    });

    attachments.push(overallStatsAttachment);

    colors.forEach(function (color, index) {
        statLine += (
            config.archerIcon[color] + ' ' +
            stats.perPlayerStats[color].wins + '/' +
            stats.perPlayerStats[color].kills + '/' +
            stats.perPlayerStats[color].deaths + '/' +
            stats.perPlayerStats[color].ratio + ' '
        );

        // Make attachment for every 3rd archer
        if (index !== 0 && ((index + 1) % statsPerLine === 0) || index === 8) {
            attachments.push({
                fallback  : fallbackText,
                pretext   : 'W/K/D/KD',
                text      : statLine,
                mrkdwn_in : ['text']
            });

            statLine = '';
        }
    });

    return attachments;
};

SlackPoster.prototype.postStats = function(stats) {
    var postData, request;

    postData = querystring.stringify({
        token       : config.slackApiKey,
        text        : 'Session Stats',
        attachments : JSON.stringify(this.getStatsAttachments(stats)),
        username    : 'TowerFall Stats Bot',
        icon_emoji  : ':video_game:',
        channel     : config.channelId
    });

    var options = {
        method : 'POST',
        host   : 'slack.com',
        path   : '/api/chat.postMessage',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
    };

    request = https.request(options, function(res) {
        if (res.statusCode >= 400) {
            console.log('Could not post stats: ' + res.statusMessage);
        }
    });

    request.write(postData);
    request.end();
};

module.exports = new SlackPoster();
