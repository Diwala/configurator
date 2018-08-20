config-cli
==========

This is a all purpose configurator for node &amp; javascript apps

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/config-cli.svg)](https://npmjs.org/package/config-cli)
[![CircleCI](https://circleci.com/gh/Diwala/config-cli/tree/master.svg?style=shield)](https://circleci.com/gh/Diwala/config-cli/tree/master)
[![Codecov](https://codecov.io/gh/Diwala/config-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/Diwala/config-cli)
[![Downloads/week](https://img.shields.io/npm/dw/config-cli.svg)](https://npmjs.org/package/config-cli)
[![License](https://img.shields.io/npm/l/config-cli.svg)](https://github.com/Diwala/config-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g configurator
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`configurator web [TOKEN] -e environment`](#configurator-hello-file)
* [`configurator help [COMMAND]`](#configurator-help-command)

## `configurator web [TOKEN] -e environment`

describe the command here

```
this is used by diwala to setup web platform config

USAGE
  $ configurator web TOKEN

ARGUMENTS
  TOKEN  Github API token

OPTIONS
  -e, --environment=environment  [default: dev] environment to choose
  -h, --help                     show CLI help

EXAMPLE
  $ configurator web -e dev d589d6c3dc87d0df365110f12ce22d5b37b5awds
```

_See code: [src/commands/hello.ts](https://github.com/Diwala/config-cli/blob/v0.0.1/src/commands/hello.ts)_

## `configurator help [COMMAND]`

display help for configurator

```
USAGE
  $ configurator help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.0/src/commands/help.ts)_
<!-- commandsstop -->
