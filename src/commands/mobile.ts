import {Command, flags} from '@oclif/command'
import validateAndPullFile from '../lib/validateAndPullFile';
import { Platform, Environment } from '../lib/configs';
import { defaultFlagsWebAndMobile } from '../common/default-flags';
import { defaultArgsWebAndMobile } from '../common/default-args';
import { defaultExample } from '../common/default-examples';

const type = 'mobile'
export default class Mobile extends Command {

  static description = `this is used by diwala to setup ${type} config`

  static examples = defaultExample();

  static flags = defaultFlagsWebAndMobile;
  static args = defaultArgsWebAndMobile;

  async run() {
    const {args, flags} = this.parse(Mobile)
    await validateAndPullFile(this, args.token, <string>flags.environment, Platform.MOBILE)
  }
}
