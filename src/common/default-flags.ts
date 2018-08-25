import {flags} from '@oclif/command'

const help = flags.help({char: 'h'})

const environment = flags.string({
  char: 'e',
  description: 'environment to choose, will use this folder under your choosen service/app',
  required: false,
  default: 'dev'
})

const repo = flags.string({
  char: 'r',
  description: 'Github repo the files exist',
  required: true
})

const service = flags.string({
  char: 'f',
  description: 'The folder of the service/app you want fetch configuration',
  required: true
})

const branch = flags.string({
  char: 'b',
  description: 'The branch you want to target',
  required: false,
  default: 'master'
})

export const defaultFlags = {
  help: help,
  environment: environment,
  repo: repo,
  service: service,
  branch: branch
}
