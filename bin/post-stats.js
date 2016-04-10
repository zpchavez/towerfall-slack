#!/usr/bin/env node
'use strict';
var fileHandler = require('towerfall-stats').fileHandler;
var slackPoster = require('../lib/slack-poster');
var config = require('towerfall-stats').config;
var fetch = require('node-fetch');
var isJsonResponse = require('../lib/is-json-response');
var argv = require('minimist')(process.argv.slice(2));

var hoursBack = parseInt(argv.h, 10) || 6;

var since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
var formattedDate = since.toJSON();
// API doesn't support fractional seconds, so get rid of those
formattedDate = formattedDate.replace(/\.\d+Z$/, 'Z');

fetch(
    `${config.apiUrl}/group/${config.groupId}/summary?start=${formattedDate}&rankings&table`
).then(response => {
    if (! isJsonResponse(response)) {
        return response.text().then(text => [text, response]);
    } else {
        return response.json().then(json => [json, response]);
    }
}).then(contentAndResponse => {
    var content = contentAndResponse[0];
    var response = contentAndResponse[1];
    if (response.ok) {
        if (parseInt(content.matches, 10) !== 0) {
            return slackPoster.postStats(content)
            .then(() => {
                process.exit(0);
            });
        } else {
            console.log('No stats to post');
            process.exit(0);
        }
    } else {
        console.log(content);
        process.exit(1);
    }
}).catch(err => {
    console.log(err, err.stack);
    process.exit(1);
});
