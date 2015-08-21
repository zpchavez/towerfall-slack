## TowerFall Slack

TowerFall Slack lets you to easily post session stats and replay gifs to Slack.

### Installation
1. npm install -g git+https://git@github.com/zpchavez/towerfall-slack.git
1. run `tf-configure` and follow the prompts. Press enter to keep the default
or existing value shown in parentheses.

### How to use
TowerFall Slack provides the following CLI commands (in addition to `tf-configure`).

1. tf-post-stats

    This will post all your stats since the last time you ran it. You will need
    to run it one time before playing your initial session so that it can create
    the stats file that it uses for comparison. If there has been no activity
    since the last time it ran, it will not post anything.

1. tf-watch-replays

    This will start watching the replay directory and upload any new replays that
    appear in it.

1. tf-post-replays

    This will post your existing replays. It takes two optional arguments which
    define a range of replays to upload e.g. `tf-post-replays 22 33` will upload replays
    22 through 33 inclusive. Omit the second argument to keep uploading until there
    are no more replays. Omit both to upload everything.

1. tf-discard-stats

    Useful if you've been playing co-op.
