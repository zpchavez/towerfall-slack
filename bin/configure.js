#!/usr/bin/env node
var fs        = require('fs');
var osHomedir = require('os-homedir');
var prompt    = require('prompt');
var consts    = require('../lib/consts');

var config = {};

if (fs.existsSync(consts.CONFIG_PATH)) {
    config = require('../lib/config');
}

var defaults = {};

switch (process.platform) {
    case 'darwin':
        defaults.tfDataFile = (
            osHomedir() + '/Library/Application Support/Towerfall/tf_saveData'
        );
        defaults.statSnapshot = (
            osHomedir() + '/Library/Application Support/Towerfall/statSnapshot'
        );
        defaults.replaysDir = (
            osHomedir() + '/Library/Application Support/Towerfall/TowerFall Replays'
        );
        break;
    case 'win32':
        defaults.tfDataFile     = '/Program Files/Steam/steamapps/common/TowerFall';
        defaults.statSnapshot = osHomedir() + '/My Documents/TowerFallStats.json';
        defaults.replaysDir   = osHomedir() + '/My Documents/TowerFall Replays';
        break;
    default:
        defaults.tfDataFile     = osHomedir() + '/.local/share/TowerFall/tf_saveData';
        defaults.statSnapshot = osHomedir() + '/.local/share/TowerFall/statSnapshot';
        defaults.replaysDir   = osHomedir() + '/.local/share/TowerFall/TowerFall Replays';
        break;
}

var schema = [
    {
        name        : 'tfDataFile',
        description : 'Path to tf_saveData',
        required    : true,
        default     : config.tfDataFile || defaults.tfDataFile
    },
    {
        name        : 'statSnapshot',
        description : (
            'Path of file in which to store stat snapshots'
        ),
        required    : true,
        default     : config.statSnapshot || defaults.statSnapshot
    },
    {
        name        : 'replaysDir',
        description : 'Directory where replays are stored',
        required    : true,
        default     : config.replaysDir || defaults.replaysDir
    },
    {
        name        : 'slackApiKey',
        description : 'API key for the Web API',
        required    : true,
        default     : config.slackApiKey
    },
    {
        name        : 'channelId',
        description : 'The ID of the channel to post things in',
        required    : true,
        default     : config.channelId
    }
];

prompt.start();

prompt.get(schema, function(error, results) {
    if (error) {
        console.log(error.message);
    } else {
        fs.writeFileSync(
            consts.CONFIG_PATH,
            JSON.stringify(results),
            {
                mode : 0600
            }
        );
        console.log('Configuration Saved');
    }
});
