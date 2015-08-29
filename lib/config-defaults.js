/* globals process */
'use strict';
var osHomedir = require('os-homedir');

var defaults = {};

switch (process.platform) {
    case 'darwin':
        defaults.replaysDir = (
            osHomedir() + '/Library/Application Support/TowerFall/TowerFall Replays'
        );
        break;
    case 'win32':
        defaults.replaysDir   = osHomedir() + '/My Documents/TowerFall Replays';
        break;
    case 'default':
        defaults.replaysDir   = osHomedir() + '/.local/share/TowerFall/TowerFall Replays';
        break;
}

module.exports = defaults;