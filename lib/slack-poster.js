var fs             = require('fs');
var https          = require('https');
var pad            = require('pad');
var querystring    = require('querystring');
var SlackUploader  = require('node-slack-upload');

var config        = require('./config');
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
                console.log('Error uploading: ' + file, err);
                return;
            }
            callback();
        }
    );
};

SlackPoster.prototype.getStatsAttachments = function(stats) {
    var attachments = [],
        overallStatsAttachment,
        table = '',
        fallbackText = 'TF Stats',
        emojify;

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

    emojify = function (v) {return ':tf-' + v + ':';};

    overallStatsAttachment.fields.push({
        title : 'Most Wins',
        value : stats.ranks.wins[0].map(emojify).join(' '),
        short : true
    });

    overallStatsAttachment.fields.push({
        title : 'Most Kills',
        value : stats.ranks.kills[0].map(emojify).join(' '),
        short : true
    });

    overallStatsAttachment.fields.push({
        title : 'Most Deaths',
        value : stats.ranks.deaths[0].map(emojify).join(' '),
        short : true
    });

    overallStatsAttachment.fields.push({
        title : 'Highest KDR',
        value : stats.ranks.kdr[0].map(emojify).join(' '),
        short : true
    });

    attachments.push(overallStatsAttachment);

    table = (
        '```PLAYER  | WINS | KILLS | DEATHS | KDR\n' +
        '---------------------------------------\n'
    );
    Object.keys(stats.perPlayerStats).forEach(function (color, index) {
        var capColor;

        capColor = color.charAt(0).toUpperCase() + color.substr(1);

        table += (
            pad(capColor, 8) + '|' + pad(5, stats.perPlayerStats[color].wins.toString()) + ' |' +
            pad(6, stats.perPlayerStats[color].kills.toString()) + ' |' +
            pad(7, stats.perPlayerStats[color].deaths.toString()) + ' |' +
            pad(6, stats.perPlayerStats[color].kdr.toString()) + '\n'
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
