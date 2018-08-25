import { Command, flags } from '@oclif/command'
import { CLIError } from '@oclif/errors'
import { defaultFlags } from '../common/default-flags';
import { defaultArgs  } from '../common/default-args';
import { defaultExample } from '../common/default-examples';
import { getConfigs, validateToken } from '../lib/setup';
import * as ora  from 'ora';

export default class Setup extends Command {
  static description = `this is used by diwala to setup all service configs`;

  static examples = defaultExample();

  static flags = defaultFlags;
  static args = defaultArgs;

  async run() {
    const {args, flags} = this.parse(Setup)
    const repo = flags.repo.split('/')
    if(repo.length != 2) {
      throw new CLIError('Invalid repo value in flag, see -h for usage')
    }
    try {
      const valid = await validateToken(args.token, flags.repo);
      const response = await getConfigs(args.token, flags.environment, flags.repo, flags.service, flags.branch)
    } catch(error) {
      throw error
    }

  }
}
