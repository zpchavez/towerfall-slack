'use strict';
var fs     = require('fs');
var consts = require('./consts');

var config, error;

if (fs.existsSync(consts.CONFIG_PATH)) {
    config = require(consts.CONFIG_PATH);
} else {
    error = new Error('Config file not found. Run tf-configure to create it.');
    error.name = 'ConfigNotFoundError';
    throw error;
}

module.exports = config;