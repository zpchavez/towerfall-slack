#!/usr/bin/env node
'use strict';
var configurer = require('towerfall-stats').configurer;
var config     = require('towerfall-stats').config;

var schema = [
    {
        name        : 'slackApiKey',
        description : 'API key for the Web API',
        required    : true,
        'default'   : config.slackApiKey
    },
    {
        name        : 'channelId',
        description : 'The ID of the channel to post things in',
        required    : true,
        'default'   : config.channelId
    }
];

configurer.setAdditionalSchema(schema);

configurer.prompt();
