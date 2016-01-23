CHANGELOG
=========

## [v0.4.1](https://github.com/zpchavez/towerfall-slack/compare/v0.4.0...v0.4.1) (2015-01-22)
* Improve reliability of file watching (by updating chokidar to version that supports awaitWriteFinish)

## [v0.4.0](https://github.com/zpchavez/towerfall-slack/compare/v0.3.0...v0.4.0) (2015-10-20)
* Update to towerfall-stats v0.3.0
* Use chokidar to replay watching

## [v0.3.0](https://github.com/zpchavez/towerfall-slack/compare/v0.2.0...v0.3.0) (2015-09-26)

* Switched to live file-watching technique for collecting stats
* Added matches played per archer
* Added win ratios
* Added winning streaks
* Simplified configuration
* Added bot config options

## [v0.2.0](https://github.com/zpchavez/towerfall-slack/compare/v0.1.0...v0.2.0) (2015-08-29)

* Fixed issue where matches and rounds were not shown in Slack.
* Fixed issue where replay watcher stopped working when replays were canceled.
* Extracted stats code into a separate package.
* Changed format of snapshot file. Run `tf-discard-stats` to update an existing snapshot file.
* Renamed config file from `towerfall-slack-config.json` to `towerfall-stats-config.json`.

## v0.1.0

* Initial Release
