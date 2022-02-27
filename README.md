camelton
========

> Generate and synchronize data skeletons across files.

## Introduction
`camelton` is a utility tool for generating and synchronizing data skeletons
(schemas) across files. The tool can be used to compare the schema (object keys)
between source and multiple destination data structures. Differences in schema
are propagated to destination files. Use cases for `camelton` include
synchronizing localization or configuration files, for example.

At the moment `camelton` only supports JSON formatted data.

Honoring the noble desert beast, the name `camelton` derives from the
combination of the words `camel` and (data) skele`ton` -> `camelton`.

#### Camelton in a nutshell

![figure](https://raw.githubusercontent.com/cowbellerina/camelton/master/figures/camelton-figure-nutshell.png "Camelton in a nutshell")

Please see [Usage examples](https://github.com/cowbellerina/camelton#usage-examples)
for more info.


## Installation

Git

```sh
git clone git@github.com:cowbellerina/camelton.git
cd camelton
npm install
```

## Usage

### CLI

```sh
camelton <source> <destination> [options]
```

#### Example

```sh
camelton source.json destination-1.json destination-2.json --sort=desc
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

##### `--sort`, `-s`

Type: `string`  
Default: `null`  
Values: `"asc"`, `"desc"`

Sort order for destination objects.

##### `--prune`, `-p`

Type: `boolean`  
Default: `false`  
Values: `true`, `false`

Prune extra properties found in destination objects.

##### `--placeholder`, `-c`

Type: `boolean`  
Default: `false`  
Values: `true`, `false`

Add source object key as a value for empty destination object properties.

##### `--verbose`, `-v`

Type: `boolean`  
Default: `false`  
Values: `true`, `false`

Verbose output.

##### `--help`, `-h`

Outputs help and usage information.

##### `--version`, `-V`

Outputs version, license and copyright information.

### Usage Examples

#### Default options

In the following example, the keys in `source.json` file are merged with the
keys found in `destination-1.json` file. The keys are ordered according to the
source file. Extra keys found in `destination-1.json` are added to the end of
the JSON object in their original order. Values are not copied.

The contents of `source.json` file.

```js
{
  "a": "a",
  "c": "c",
  "d": {
    "db": "db"
  }
}
```

The contents of `destination-1.json` file **before** running `camelton`.

```js
{
  "b": "b",
  "c": "`c",
  "d": {
    "da": "da"
  }
}
```

Running `camelton` with default options.

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', 'destination-1.json');
camelton.run();
```

The contents of `destination-1.json` file **after** running `camelton`. The
keys `a` and `db` are added to the JSON object. Existing keys `da` and `b` are
preserved and added to the end of the objects.

The generated output.

```js
{
  "a": "",
  "c": "`c",
  "d": {
    "db": "",
    "da": "da"
  },
  "b": "b"
}
```

#### Custom options

##### Sort

The keys in destination objects can be sorted by adding `asc` or `desc` sort
option. Running `camelton` using the same source and destination files as in
the previous example generates the following output with sort option on.

Ascending sort order.

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', 'destination-1.json', {sort: 'asc'});
camelton.run();
```

The generated output.

```js
{
  "a": "",
  "b": "b",
  "c": "`c",
  "d": {
    "da": "da",
    "db": ""
  }
}
```

Descending sort order.

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', 'destination-1.json', {sort: 'desc'});
camelton.run();
```

The generated output.

```js
{
  "d": {
    "db": "",
    "da": "da"
  },
  "c": "`c",
  "b": "b",
  "a": ""
}
```

##### Prune

Extra properties found in destination objects can be removed using the `prune`
option.

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', 'destination-1.json', {prune: true});
camelton.run();
```

The generated output. `b` and `da` properties have been removed.

```js
{
  "a": "",
  "c": "`c",
  "d": {
    "db": ""
  }
}
```

##### Placeholder

The key of the source object can be added as a placeholder value for empty
destination objects properties using the `placeholder` option. Non-empty
properties are never overridden.

The contents of `source.json` file.

```js
{
  "aKey": "aValue",
  "cKey": "cValue",
  "dKey": {
    "dbKey": "dbValue"
  }
}
```

The contents of `destination-1.json` file **before** running `camelton`.

```js
{
  "bKey": "bValue",
  "cKey": "`cValue",
  "dKey": {
    "daKey": "daValue"
  }
}
```

Running `camelton` with `placeholder` option.

```js
var Camelton = require('camelton');

var camelton = new Camelton('source.json', 'destination-1.json', {placeholder: true});
camelton.run();
```

The generated output. `aKey` and `dbKey` properties have placeholder values of
`aKey` and `dbKey` while other properties' previously existed values are
retained.

```js
{
  "aKey": "aKey",
  "cKey": "`cValue",
  "dKey": {
    "dbKey": "dbKey",
    "daKey": "daValue"
  },
  "bKey": "bValue"
}

```

## Tests, development and documentation

Running linters and Nodeunit unit test

```sh
npm test
```

Running coverage

```sh
npm run-script coverage
```

Running JSHint and JSCS linters

```sh
grunt lint
```

Generating JSDoc documentation

```sh
grunt docs
```

## Changelog

Please see [changelog](https://github.com/cowbellerina/camelton/blob/master/CHANGELOG.md).

## License

Copyright &copy; cowbellerina

Licensed under the [MIT license](https://github.com/cowbellerina/camelton/blob/master/LICENSE).
