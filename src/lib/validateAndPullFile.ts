const _ = require('lodash');
const ora = require('ora');
const setupMethods = require('./setup');
import { Environment, Platform, getConfigSettings } from './configs';

export default async (oclif: any,token: string, environment: string, platform: string) => {
  const tokenValidateSpinner = ora('Validating Github API token.').start();
  const validatedResponse = await setupMethods.validateToken(token);
  if (validatedResponse.status === 200) {
    tokenValidateSpinner.succeed(validatedResponse.message);

    ora('Initializing configurator...').info();
    // Download configs
    const config = getConfigSettings(platform, environment);
    if (!config) {
      ora(`Missing configurations for ${environment} ${platform}!`).fail();
      oclif.exit(1)
    } else {
      config.configs.forEach(async (conf) => {
        const streamSpinner = ora(`Downloading ${environment} configuration file[s] for ${platform}`).start();
        const downloadResponse = await setupMethods.downloadFile(conf, token);
        if (downloadResponse.status === 200) {
          streamSpinner.succeed(downloadResponse.message);
        } else {
          streamSpinner.fail(downloadResponse.message).frame();
        }
      });
    }
  } else {
    tokenValidateSpinner.fail(validatedResponse.message);
    oclif.exit(1)
  }
}
