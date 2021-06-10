const { App } = require('@slack/bolt');
var config = require('towerfall-stats').config;

if (!config.signingSecret) {
  throw new Error('signingSecret missing from config');
}

const app = new App({
    token: config.slackApiKey,
    signingSecret: config.signingSecret,
});

module.exports = app.client;