## TowerFall Slack

TowerFall Slack lets you to easily post session stats and replay gifs to Slack.

![tf-stats-screenie](https://cloud.githubusercontent.com/assets/717690/9399440/3190a8b2-4769-11e5-8646-052e96201721.png)

Not tested on Windows or Linux, but might work.

### Installation
1. npm install -g git+https://git@github.com/zpchavez/towerfall-slack.git
1. run `tf-configure` and follow the prompts. Press enter to keep the default
or existing value shown in parentheses.

#### Emojis
You will also need to add custom emojis for all the archers. Each one
should follow the format `:tf-color:`.

![tf-blue](https://cloud.githubusercontent.com/assets/717690/9399443/3f66d66e-4769-11e5-81ff-b4a7744f86d5.png)![tf-cyan](https://cloud.githubusercontent.com/assets/717690/9399444/3f6e83a0-4769-11e5-9715-e0cd465f8c36.png)![tf-green](https://cloud.githubusercontent.com/assets/717690/9399445/3f6f625c-4769-11e5-8303-a4049864cbfc.png)![tf-orange](https://cloud.githubusercontent.com/assets/717690/9399446/3f6fcd14-4769-11e5-85f1-395aa55ba4b8.png)![tf-pink](https://cloud.githubusercontent.com/assets/717690/9399447/3f739f5c-4769-11e5-916c-0bdcf6dfd5cb.png)![tf-purple](https://cloud.githubusercontent.com/assets/717690/9399448/3f745988-4769-11e5-8e62-54b0617a019f.png)![tf-red](https://cloud.githubusercontent.com/assets/717690/9399449/3f78d850-4769-11e5-96bb-510b6b4c76ba.png)![tf-white](https://cloud.githubusercontent.com/assets/717690/9399450/3f7fca66-4769-11e5-97f5-406094fb7d86.png)![tf-yellow](https://cloud.githubusercontent.com/assets/717690/9399451/3f83670c-4769-11e5-9a71-30ccb4ac6fd1.png)

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
