#!/usr/bin/env node
'use strict';
var fileHandler = require('towerfall-stats').fileHandler;
var slackPoster = require('../lib/slack-poster');
var config = require('towerfall-stats').config;
var fetch = require('node-fetch');
var isJsonResponse = require('../lib/is-json-response');
var argv = require('minimist')(process.argv.slice(2));

var hoursBack = parseInt(argv.h, 10) || 6;
var type = argv.t;
var typeString = type ? `&type=${type}` : '';
var teams = argv.teams;
var matchups = argv.matchups;

var since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
var formattedDate = since.toJSON();
// API doesn't support fractional seconds, so get rid of those
formattedDate = formattedDate.replace(/\.\d+Z$/, 'Z');

var path = `/group/${config.groupId}/`;
if (teams) {
    path += 'team-summary';
} else if (matchups) {
    path += 'matchups-summary';
} else {
    path += 'summary';
}
var queryString = `?start=${formattedDate}&rankings&table${typeString}`;

fetch(
    `${config.apiUrl}${path}${queryString}`
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
        if (matchups) {
            var promises = [];
            content.forEach(matchup => {
                promises.push(
                    slackPoster.postStats(
                        matchup,
                        `*${matchup.stats[0].team.join('/')} vs ${matchup.stats[1].team.join('/')}*`
                    )
                );
            });
            Promise.all(promises).then(() => {
                process.exit(0);
            });
        } else if (parseInt(content.matches, 10) !== 0) {
            var headingText;
            switch (type) {
                case 'ffa':
                    headingText = '*Free-for-all Stats*';
                    break;
                case '2v2':
                    headingText = '*2v2 Stats*';
                    break;
                default:
                    headingText = teams ? '*Overall Team Stats*' : '*Overall Stats*';
                    break;
            }
            return slackPoster.postStats(content, headingText)
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
