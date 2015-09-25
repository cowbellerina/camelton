Changelog
=========

## 1.1.1 _(26th Sep 2015)_
* [Code coverage](https://coveralls.io/github/tuunanen/camelton?branch=master)
  increased from 84.13% to 93.65% (finally green)
* `tmp` directory added to `.gitignore`
* Dollar signs removed from README shell commands

## 1.1.0 _(20th Sep 2015)_
* Options
  * --placeholder: source object key may be added as a placeholder value for
  empty destination object properties.

## 1.0.1 _(20th Sep 2015)_
* Fixed issue with JSON output formatting caused by changes in fs-extra &
  jsonfile.

## 1.0.0 _(15th Dec 2014)_
* Usage examples
* Project published to npm

## 0.3.0 _(11th Dec 2014)_
* Reporter for CLI
* Options
  * --sort: asc, desc. Source object property used if none defined.
  * --prune: extra properties found in destination objects may be removed.
* Custom object schema merge function
* Code coverage testing
  * [Coveralls](https://coveralls.io/)
* More unit tests (90% coverage targeted, 83% reached)

## 0.2.0 _(17th Nov 2014)_
* Object schema merge
* Options
  * --sort: Basic sorting options for keys
* Unit tests using nodeunit
* Grunt tasks for linting and running tests
* Wercker integration
* Badge showing the current build status

## 0.1.0 _(21st Oct 2014)_
* Basic command line interface
* Proof of Concept implementation
* JSHint, JSCS, and JSDoc linting

## 0.0.0
* Initial commit
