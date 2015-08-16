module.exports = {
    // Path to the XML file where TowerFall saves stats
    tfDataFile : '/Users/yourname/Library/Application Support/TowerFall/tf_saveData',
    // Path where a new file will be created that contains a snapshot of your stats since the file last changed
    statSnapshot : '/Users/yourname/Library/Application Support/TowerFall/statSnapshot',
    //Path to folder where replay gifs are stored
    replaysDir : '/Users/yourname/Library/Application Support/TowerFall/TowerFall Replays',
    // API key for the Web API
    slackApiKey   : '',
    // The ID of the channel to post things in
    channelId : 'CXXXXXXXX',
    // Text or emoji that will represent each archer
    archerIcon : {
        green  : ':tf-green:',
        blue   : ':tf-blue:',
        pink   : ':tf-pink:',
        orange : ':tf-orange:',
        white  : ':tf-white:',
        yellow : ':tf-yellow:',
        cyan   : ':tf-cyan:',
        purple : ':tf-purple:',
        red    : ':tf-red:'
    }
};