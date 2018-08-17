#!/usr/bin/env node

const _ = require('lodash');
const program = require('commander');
const ora = require('ora');
const setup = require('../lib/setup');
const { Environment, Platform, getConfigSettings } = require('../lib/configs');

program
  .version('0.0.1', '-v, --version')
  .command('setup-web')
  .description('Download and configure web application configuration files')
  .option('-e --environment <environment>', 'Environment type', 'dev')
  .option('-t --token <token>', 'Github API token')
  // .option('--proxy-only', 'Download and configure proxy configs only')
  // .option('--configs-only', 'Download and configure web application configs only')
  .on('--help', () => {
    console.log('  Example:');
    console.log();
    console.log('    $ setup-web -e dev -t d589d6c3dc87d0df365110f12ce22d5b37b5awds');
    console.log();
  })
  .action(async (options) => {
    // Validate token
    const tokenValidateSpinner = ora('Validating Github API token.').start();
    const validatedResponse = await setup.validateToken(options.token);
    if (validatedResponse.status === 200) {
      tokenValidateSpinner.succeed(validatedResponse.message);

      ora('Initializing configurator...').info();
      const selectedEnv = _.findKey(Environment, o => o === options.environment);
      if (typeof selectedEnv === 'undefined') {
        ora('Unknown enviroment selected. Please check and try again.').fail();
        process.exit(1);
      }

      // Download configs
      const config = getConfigSettings(Platform.Web, Environment[selectedEnv]);
      if (!config) {
        ora(`Missing configurations for ${options.environment} ${Platform.Web}!`).fail();
        process.exit(1);
      }
      config.configs.forEach(async (file) => {
        const streamSpinner = ora(`Downloading ${config.environment} ${file.type} configuration file for ${config.platform}`).start();
        const downloadResponse = await setup.downloadFile(file, options.token);
        if (downloadResponse.status === 200) {
          streamSpinner.succeed(downloadResponse.message);
        } else {
          streamSpinner.fail(downloadResponse.message).frame();
        }
      });
    } else {
      tokenValidateSpinner.fail(validatedResponse.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
