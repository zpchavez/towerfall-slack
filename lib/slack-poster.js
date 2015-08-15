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

var colorToHex = {
    green  : '#00CC00',
    blue   : '#0000FF',
    pink   : '#FFC0CB',
    orange : '#FFA500',
    white  : '#FFFFFF',
    yellow : '#FFFF00',
    cyan   : '#00FFFF',
    purple : '#800080',
    red    : '#FF0000'
};

SlackPoster.prototype.postReplay = function(file) {
    slackUploader.uploadFile(
        {
            file     : fs.createReadStream(file),
            channels : config.channelId
        },
        function(err) {
            if (err) {
                throw err;
            }
        }
    );
};

SlackPoster.prototype.getStatsAttachments = function(stats) {
    var attachments = [], overallStatsAttachment, padSize = 5;

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

    attachments.push({
        fallback  : fallbackText,
        text      : "```" + (
            pad('K', padSize) + pad('D', padSize) + pad('K\\D', padSize)
        ) + "```",
        mrkdwn_in : ['text']
    });

    colors.forEach(function (color) {
        attachments.push({
            fallback : fallbackText,
            color    : colorToHex[color],
            pretext  : color,
            text     : "```" + (
                pad(stats.perPlayerStats[color].kills.toString(), padSize) +
                pad(stats.perPlayerStats[color].deaths.toString(), padSize) +
                pad(stats.perPlayerStats[color].ratio.toString(), padSize)
            ) + "```",
            mrkdwn_in : ['text']
        });
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
