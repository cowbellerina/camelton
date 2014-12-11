camelton
========

[![wercker status](https://app.wercker.com/status/e8efc33471deb952a82c2d272ffb769d/s "wercker status")](https://app.wercker.com/project/bykey/e8efc33471deb952a82c2d272ffb769d)
[![Coverage Status](https://coveralls.io/repos/tuunanen/camelton/badge.png?branch=master)](https://coveralls.io/r/tuunanen/camelton?branch=master)

> Generate and synchronize data skeletons across files.

## Introduction
`camelton` is a utility tool for generating and synchronizing data skeletons
across files. The tool can be used to compare the schema (object keys) of a data
structure between source and destination files. The schema can be generated and
synchronized across multiple files. Use cases for `camelton` include generating
and synchronizing localization files or test data, for example.

At the moment `camelton` only supports JSON formatted data.

Please see
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
$ camelton <source> <destination> [options]
```

#### Example

```sh
$ camelton source.json destination-1.json destination-2.json --sort=desc
```

### Node

```js
var camelton = new Camelton(source, destination, options);
camelton.run();
```

#### Example

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', ['destination-1.json', 'destination-2.json'], {sort: 'desc'});
camelton.run();
```

### Options

##### `--prune`, `-p`

Type: `boolean`
Default: `false`
Values: `true`, `false`

Prune extra properties found in destination objects.

##### `--sort`, `-s`

Type: `string`  
Default: `null`  
Values: `"asc"`, `"desc"`

Sort order for destination objects.

##### `--verbose`, `-v`

Verbose output.

##### `--help`, `-h`

Outputs help and usage information.

##### `--version`, `-V`

Outputs version, license and copyright information.

## Test

Running linters and Nodeunit unit test

```sh
$ npm test
```

Running JSHint and JSCS linters

```sh
$ grunt lint
```

## Roadmap

### Version 0.3.0
* Reporter for CLI
* Options
  * --sort: Additional [sort-object](https://www.npmjs.org/package/sort-object) options.
* Code coverage testing
  * [Coveralls](https://coveralls.io/)
* More unit tests (90% coverage target)

### Version 1.0
* Project published to npm
* Grunt wrapper (separate repository)

## Changelog

Please see [changelog](https://github.com/tuunanen/camelton/blob/master/CHANGELOG.md).

## License

Copyright &copy; tuunanen

Licensed under the [MIT license](https://github.com/tuunanen/camelton/blob/master/LICENSE).
