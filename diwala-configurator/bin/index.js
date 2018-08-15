#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
const ora = require('ora');
const setup = require('../lib/setup');
const { configs } = require('../lib/configs');

program
  .version('0.0.1', '-v, --version')
  .command('setup <environment> <platform> <token>')
  .usage('<environment> (dev|prod) <platform> (web|mobile) <github-api-token>')
  .description('Download and configure application configuration files.')
  .option('--proxy-only', 'Download and configure proxy configs only. ONLY AVAILABLE FOR WEB PLATFORM.')
  .option('--web-configs-only', 'Download and configure web application configs only. ONLY AVAILABLE FOR WEB PLATFORM.')
  .on('--help', function () {
    console.log('  Example:');
    console.log();
    console.log('    $ setup dev web d589d6c3dc87d0df365110f12ce22d5b37b5awds');
    console.log();
  })
  .action(async function(environment, platform, token) {
    const tokenValidateSpinner = ora('Validating Github API token.').start();
    const isValidToken = await setup.validateToken(token);
    if (isValidToken.status === 200) {
      tokenValidateSpinner.succeed(isValidToken.message);
    } else {
      tokenValidateSpinner.fail(isValidToken.message);
    }

    console.log(configs[0].configs[0]);
    await setup.downloadFile(configs[0].configs[0]);
    // console.log(colors.red(isValidToken))
    // if (!environment && !platform && !token) {
    //   console.log(colors.red('Invalid arguments. Usage: setup <environment> <platform> <token>'));
    // }
  });

program.parse(process.argv);
