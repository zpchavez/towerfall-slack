#!/usr/bin/env node
'use strict';
var configurer = require('towerfall-stats').configurer;
var config     = require('towerfall-stats').config;
var defaults   = require('../lib/config-defaults');

var schema = [
    {
        name        : 'replaysDir',
        description : 'Directory where replays are stored',
        required    : true,
        'default'   : config.replaysDir || defaults.replaysDir
    },
    {
        name        : 'slackApiKey',
        description : 'API key for the Slack Web API with chat:write and files:write scopes',
        required    : true,
        'default'   : config.slackApiKey
    },
    {
        name        : 'signingSecret',
        description : 'The signing secret for the slack app',
        required    : true,
        'default'   : config.signingSecret
    },
    {
        name        : 'channelId',
        description : 'The ID of the channel to post things in',
        required    : true,
        'default'   : config.channelId
    },
    {
        name        : 'postAsBot',
        type        : 'boolean',
        description : 'Whether to post as a bot (rather than the user to which the API key belongs)',
        required    : true,
        'default'   : typeof config.postAsBot !== 'undefined' ? config.postAsBot : defaults.postAsBot
    },
    {
        name        : 'botName',
        description : 'Name of bot to post as. Leave blank to post as the user to which the API key belongs',
        required    : false,
        'default'   : config.botName || defaults.botName
    },
    {
        name        : 'botEmoji',
        description : 'Emoji to use for the bot',
        required    : true,
        'default'   : config.botEmoji || defaults.botEmoji
    }
];

configurer.setAdditionalSchema(schema);

configurer.prompt();
