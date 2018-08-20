import {Command, flags} from '@oclif/command'
import validateAndPullFile from '../lib/validateAndPullFile';
import { Platform, Environment } from '../lib/configs';

export default class Mobile extends Command {
  static description = 'this is used by diwala to setup mobile config'

  static examples = [
    `$ configurator mobile -e dev d589d6c3dc87d0df365110f12ce22d5b37b5awds
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    environment: flags.string({
      char: 'e',
      description: 'environment to choose',
      required: false,
      default: 'dev'
    }),
  }

  static args = [{
    name: 'token',
    required:true,
    description:'Github API token'
  }]

  async run() {
    const {args, flags} = this.parse(Mobile)
    await validateAndPullFile(this, args.token, <string>flags.environment, Platform.MOBILE)
  }
}
