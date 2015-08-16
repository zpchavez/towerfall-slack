var fs             = require('fs');
var https          = require('https');
var pad            = require('pad');
var querystring    = require('querystring');
var SlackUploader  = require('node-slack-upload');

var colors        = require('./colors');
var config        = require('../config');
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
                throw err;
            }
            callback();
        }
    );
};

SlackPoster.prototype.getStatsAttachments = function(stats) {
    var attachments = [],
        overallStatsAttachment,
        table = '',
        fallbackText = 'TF Stats';

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

    table = (
        '```PLAYER  | WINS | KILLS | DEATHS | KDR\n' +
        '--------------------------------------\n'
    );
    colors.forEach(function (color, index) {
        var capColor;

        capColor = color.charAt(0).toUpperCase() + color.substr(1);

        table += (
            pad(capColor, 8) + '|' + '   ' + pad(stats.perPlayerStats[color].wins.toString(), 3) + '|' +
            '   ' + pad(stats.perPlayerStats[color].kills.toString(), 4) + '|' +
            '   ' + pad(stats.perPlayerStats[color].deaths.toString(), 5) + '|' +
            ' ' + pad(stats.perPlayerStats[color].ratio.toString(), 3) + '\n'
        );
    });

    table += '```';

    attachments.push({
        fallback  : fallbackText,
        text      : table,
        mrkdwn_in : ['text']
    });

    return attachments;
};

SlackPoster.prototype.postStats = function(stats) {
    var postData, request, options;

    postData = querystring.stringify({
        token       : config.slackApiKey,
        text        : 'Session Stats',
        attachments : JSON.stringify(this.getStatsAttachments(stats)),
        username    : 'TowerFall Stats Bot',
        icon_emoji  : ':video_game:',
        channel     : config.channelId
    });

    options = {
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
