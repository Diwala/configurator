import {Command, flags} from '@oclif/command'
import {CLIError} from '@oclif/errors'
import validateAndPullFile from '../lib/validateAndPullFile';
import { Platform, Environment } from '../lib/configs';
import { defaultFlagsWebAndMobile } from '../common/default-flags';
import { defaultArgsWebAndMobile } from '../common/default-args';
import { defaultExample } from '../common/default-examples';
import { getConfigs } from '../lib/setup';
import { ErrorTypes } from '../errors/error-handler';

const type = 'web'

export default class Test extends Command {
  static description = `this is used by diwala to setup ${type} platform config`;

  static examples = defaultExample();

  static flags = defaultFlagsWebAndMobile;
  static args = defaultArgsWebAndMobile;

  async run() {
    const {args, flags} = this.parse(Test)
    const repo = flags.repo.split('/')
    if(repo.length != 2) {
      throw new CLIError('Invalid repo value in flag, see -h for usage')
    }
    try {
      await getConfigs(args.token, flags.environment, flags.repo, flags.service, flags.branch)
    } catch(error) {
      throw error
    }

  }
}
