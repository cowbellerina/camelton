camelton
========

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

```
git clone git@github.com:tuunanen/camelton.git
```

## Usage

### CLI

```
camelton [options]
```

#### Example

```
camelton --src=en_US.json --dest=fi_FI.json,fi_SV.json
```

#### `--help`, `-h`

Outputs help and usage information.

#### `--version`, `-v`

Outputs version, license and copyright information.

## Options

### `--src`

Type: `String`

Default: `null`

Path to source file.

#### Example

```
camelton --src=en_US.json
```

### `--dest`

Type: `String`

Default: `null`

Comma-separated list of paths to destination files where data from source file
should be generated or synchronized.

#### Example

```
camelton --dest=fi_FI.json,fi_SV.json
```

## Roadmap

### Version 0.1.0 _(21st Oct 2014)_
* Basic command line interface
* JSHint, JSCS, and JSDoc linting

### Version 0.2.0 _(28th Oct 2014)_
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
