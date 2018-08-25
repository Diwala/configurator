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
$ npm install -g @diwala/configurator
$ configurator COMMAND
running command...
$ configurator (-v|--version|version)
@diwala/configurator/0.1.0 darwin-x64 node-v9.10.0
$ configurator --help [COMMAND]
USAGE
  $ configurator COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`configurator help [COMMAND]`](#configurator-help-command)
* [`configurator setup TOKEN`](#configurator-setup-token)

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

## `configurator setup TOKEN`

this is used by to setup all service configs based on a strict github folder structure

```
USAGE
  $ configurator setup TOKEN

ARGUMENTS
  TOKEN  Github API token

OPTIONS
  -b, --branch=branch            [default: master] The branch you want to target

  -e, --environment=environment  [default: dev] environment to choose, will use this folder under your choosen
                                 service/app

  -f, --service=service          (required) The folder of the service/app you want fetch configuration

  -h, --help                     show CLI help

  -r, --repo=repo                (required) Github repo the files exist

EXAMPLES
  This fetches (configuration) files based on your folder structure in your Github repo
  $ configurator d589d6c3dc87d0df365110f12ce22d5b37b5awds -r facebook/react -f .circleci
  $ configurator d589d6c3dc87d0df365110f12ce22d5b37b5awds -e sys -r facebook/watchman -f winbuild
  PS. make sure to write the repo correctly
```

_See code: [src/commands/setup.ts](https://github.com/Diwala/configurator/blob/v0.1.0/src/commands/setup.ts)_
<!-- commandsstop -->
