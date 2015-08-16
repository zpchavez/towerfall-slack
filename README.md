## TowerFall Slack

TowerFall Slack lets you to easily post session stats and replay gifs to Slack.

### Installation
1. npm install -g git+https://git@github.com/zpchavez/towerfall-slack.git
1. Navigate to `towerfall-slack` in your global node_modules directory (`/usr/local/lib/node_modules` on OSX)
1. Copy `config.dist.js` to `config.js`
1. Set config values

### How to use
TowerFall slack provides three CLI commands.

1. tf-post-stats

This will post all your stats since the last time you ran it. You will
need to run it once to initialize it. If you don't wish to run this manually
after every session, you might want to set it up to run as a cron.

2. tf-replay-watch

This will start watching the replay directory and upload any new replays that
appear in it.

3. tf-post-replays

This will post your existing replays. It takes two optional arguments which
define a range of replays to upload e.g. `tf-post-replays 22 33` will upload replays
22 through 33 inclusive. Omit the arguments to upload all replays, and omit the
second argument to upload until there are no more replays to upload.
