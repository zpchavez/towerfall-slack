'use strict';
var fs            = require('fs');
var https         = require('https');
var pad           = require('pad');
var querystring   = require('querystring');
var colors        = require('towerfall-stats').colors;
var statsParser   = require('towerfall-stats').parser;
var SlackUploader = require('node-slack-upload');

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
                console.log('Error uploading: ' + file);
                console.log(err);
                return;
            }
            callback();
        }
    );
};

SlackPoster.prototype.postStats = function(stats, callback) {
    var postData, request, options;

    callback = callback || function() {};

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
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            body = JSON.parse(body);
            if (! body.ok) {
                console.log('Could not post stats: ' + body.error);
            } else {
                callback(body);
            }
        });
    });

    request.write(postData);
    request.end();
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

    var emojify  = function (v) {return ':tf-' + v + ':';};
    var rankings = statsParser.getRankings(stats);

    overallStatsAttachment.fields.push({
        title   : 'Most Wins',
        value   : rankings.wins[0].map(emojify).join(' '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Most Kills',
        value   : rankings.kills[0].map(emojify).join(' '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Most Deaths',
        value   : rankings.deaths[0].map(emojify).join(' '),
        'short' : true
    });

    overallStatsAttachment.fields.push({
        title   : 'Highest KDR',
        value   : rankings.kdr[0].map(emojify).join(' '),
        'short' : true
    });

    var attachments = [];
    attachments.push(overallStatsAttachment);

    var table = (
        '```PLAYER  | WINS | KILLS | DEATHS | KDR\n' +
        '---------------------------------------\n'
    );
    colors.forEach(function (color, index) {
        // Skip archers with no activity
        if (stats.kills[color] === 0 && stats.deaths[color] === 0) {
            return;
        }

        var ucFirstColor = color.charAt(0).toUpperCase() + color.substr(1);

        table += (
            pad(ucFirstColor, 8) + '|' +
            pad(5, stats.wins[color].toString()) + ' |' +
            pad(6, stats.kills[color].toString()) + ' |' +
            pad(7, stats.deaths[color].toString()) + ' |' +
            pad(6, stats.kdr[color].toString()) + '\n'
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

module.exports = new SlackPoster();
