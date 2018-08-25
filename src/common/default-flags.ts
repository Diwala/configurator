import {flags} from '@oclif/command'

const help = flags.help({char: 'h'})

const environment = flags.string({
  char: 'e',
  description: 'environment to choose',
  required: false,
  default: 'dev'
})

const repo = flags.string({
  char: 'r',
  description: 'Github repo the files exist',
  required: true
})

const service = flags.string({
  char: 's',
  description: 'The service/app you want to configure',
  required: true
})

const branch = flags.string({
  char: 'b',
  description: 'The branch you want to target',
  required: false,
  default: 'master'
})

export const defaultFlagsWebAndMobile = {
  help: help,
  environment: environment,
  repo: repo,
  service: service,
  branch: branch
}
