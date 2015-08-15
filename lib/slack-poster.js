var fs             = require('fs');
var SlackUploader  = require('node-slack-upload');

var config        = require('../config');
var slackUploader = new SlackUploader(config.slackApiKey);

var SlackPoster = function() {};

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

module.exports = new SlackPoster();
