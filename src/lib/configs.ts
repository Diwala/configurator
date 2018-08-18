const _ = require('lodash');

const GH_API = 'https://api.github.com';
const REPO = `${GH_API}/repos/Diwala/config-cert-platform`;
const CONTENTS = `${REPO}/contents`;

// Enums
enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
};

enum Environment {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
};

interface Config {
  source: string;
  destination: string;
}

interface Configs extends Array<Config>{}

interface Configurations {
    [key: string]: {
        [key: string]: {
            configs: Configs
        }
    }
}

// Configurations
const Configurations:Configurations = {
  web: {
    dev: {
      configs: [{
        source: `${CONTENTS}/frontend/${Environment.DEV}/config.json`,
        destination: 'client/config.json',
      },
      {
        source: `${CONTENTS}/backend/${Environment.DEV}/config.json`,
        destination: 'src/config.json',
      }],
    },
    prod: {
      configs: [{
        source: `${CONTENTS}/frontend/${Environment.PROD}/config.json`,
        destination: 'client/config.json',
      },
      {
        source: `${CONTENTS}/backend/${Environment.PROD}/config.json`,
        destination: 'src/config.json',
      }],
    }
  },
  mobile: {
    dev: {
      configs: [{
        source: `${CONTENTS}/${Platform.MOBILE}/${Environment.DEV}/config.json`,
        destination: 'src/config.json',
      }],
    },
    prod: {
      configs: [{
        source: `${CONTENTS}/${Platform.MOBILE}/${Environment.PROD}/config.json`,
        destination: 'src/config.json',
      }],
    }
  }
};

/**
 * Get configuration settings for selected platform and environment
 *
 * @param {String} platform Platform
 * @param {[type]} environment
 * @return {[type]}
 */
const getConfigSettings = (platform: string, environment: string) => {
  return Configurations[platform][environment]
};

export {
  REPO,
  Platform,
  Environment,
  getConfigSettings,
};
