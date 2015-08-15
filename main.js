var fs     = require('fs');
var xml2js = require('xml2js');
var config = require('./config');

var tfDataFile   = config.tfDataFile;
var statSnapshot = config.statSnapshot;
var parser       = new xml2js.Parser({async : false});

var fileHandler = require('./lib/file-handler');

// Watch for new stats
fs.exists(statSnapshot, function(exists) {
    if (! exists) {
        fileHandler.createSnapshotFile(
            fileHandler.watchSaveDataFile.bind(fileHandler)
        );
    } else {
        fileHandler.watchSaveDataFile();
    }
});

