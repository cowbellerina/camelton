camelton
========

[![wercker status](https://app.wercker.com/status/e8efc33471deb952a82c2d272ffb769d/s "wercker status")](https://app.wercker.com/project/bykey/e8efc33471deb952a82c2d272ffb769d)

> Generate and synchronize data skeletons across files.

## Introduction
`camelton` is a utility tool for generating and synchronizing data skeletons
across files. The tool can be used to compare the schema (object keys) of a data
structure between source and destination files. The schema can be generated and
synchronized across multiple files. Use cases for `camelton` include generating
and synchronizing localization files or test data, for example.

At the moment `camelton` can only be used from the command line and it only
supports JSON formatted data. Please see
[roadmap](https://github.com/tuunanen/camelton#roadmap) for feature plan.

## Installation

Using git

```sh
$ git clone git@github.com:tuunanen/camelton.git
$ cd camelton
$ npm install
```

## Usage

### CLI

```sh
$ camelton <input> <output> [options]
```

#### Example

```sh
$ camelton input.json output-1.json output-2.json
```

### Options

##### `--help`, `-h`

Outputs help and usage information.

##### `--version`, `-v`

Outputs version, license and copyright information.

## Test

Running Nodeunit unit test

```sh
$ npm test
```

Running JSHint and JSCS linters

```sh
$ grunt lint
```

## Roadmap

### Version 0.2.0 _(28th Oct 2014)_
* Object schema merge
* Options
  * --sort: Basic sorting options for keys
  * --preserve-extra: Preserve extra keys in destination files
* Unit tests using nodeunit
* Grunt tasks for linting and running tests
* Wercker integration
* Badge showing the current build status

### Version 0.3.0 _(18th Nov 2014)_

### Version 1.0 _(9th Dec 2014)_
* Project published to npm
* Grunt wrapper (separate repository)

## Changelog

Please see [changelog](https://github.com/tuunanen/camelton/blob/master/CHANGELOG.md).

## License

Copyright &copy; tuunanen

Licensed under the [MIT license](https://github.com/tuunanen/camelton/blob/master/LICENSE).
