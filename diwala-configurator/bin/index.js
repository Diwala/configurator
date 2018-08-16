#!/usr/bin/env node

const _ = require('lodash');
const program = require('commander');
const colors = require('colors');
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
  .action((options) => {
    // Validate token
    const tokenValidateSpinner = ora('Validating Github API token.').start();
    setup.validateToken(options.token, (err, res) => {
      if (res.status === 200) {
        tokenValidateSpinner.succeed(res.message);

        ora('Initializing configurator...').info();
        const selectedEnv = _.findKey(Environment, o => o === options.environment);
        if (typeof selectedEnv === 'undefined') {
          ora('Unknown enviroment selected. Please check and try again.').fail();
          process.exit(1);
        }

        // Download web configs
        const config = getConfigSettings(Platform.Web, Environment[selectedEnv]);
        if (!config) {
          ora(`Missing configurations for ${options.environment} ${Platform.Web}!`).fail();
          process.exit(1);
        }
        config.configs.forEach((file) => {
          const streamSpinner = ora(`Downloading ${config.environment} ${file.type} configuration file for ${config.platform}`).start();
          setup.downloadFile(file, options.token, (e, r) => {
            if (e) {
              streamSpinner.fail(r.message).frame();
            } else {
              streamSpinner.succeed(r.message);
            }
          });
        });
      } else {
        tokenValidateSpinner.fail(res.message);
        process.exit(1);
      }
    });
  });

program.parse(process.argv);
