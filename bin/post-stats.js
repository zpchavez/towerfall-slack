#!/usr/bin/env node
'use strict';
var fileHandler = require('towerfall-stats').fileHandler;
var slackPoster = require('../lib/slack-poster');
var config      = require('towerfall-stats').config;
var fetch       = require('node-fetch');

// Post stats from the last 6 hours.

var sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
var formattedDate = sixHoursAgo.toJSON();
// API doesn't support fractional seconds, so get rid of those
formattedDate = formattedDate.replace(/\.\d+Z$/, 'Z');

fetch(
    `${config.apiUrl}/group/${config.groupId}/summary?start=${formattedDate}&rankings&table`
).then(response => {
    response.json().then(json => {
        if (response.ok) {
            if (parseInt(json.matches, 10) !== 0) {
                return slackPoster.postStats(json)
                    .then(() => {
                        process.exit(0);
                    });
            } else {
                console.log('No stats to post');
                process.exit(0);
            }
        } else {
            console.log(json);
            process.exit(1);
        }
    }).catch(err => {
        console.log(err, err.stack);
        process.exit(1);
    });
});
