import {Command, flags} from '@oclif/command'
import validateAndPullFile from '../lib/validateAndPullFile';
import { Platform, Environment } from '../lib/configs';
import { defaultFlagsWebAndMobile } from '../common/default-flags';
import { defaultArgsWebAndMobile } from '../common/default-args';
import { defaultExample } from '../common/default-examples';

const type = 'web'

export default class Web extends Command {
  static description = `this is used by diwala to setup ${type} platform config`;

  static examples = defaultExample();

  static flags = defaultFlagsWebAndMobile;
  static args = defaultArgsWebAndMobile;

  async run() {
    const {args, flags} = this.parse(Web)
    await validateAndPullFile(this, args.token, <string>flags.environment, Platform.WEB)
  }
}
