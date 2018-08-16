const _ = require('lodash');

const GH_API = 'https://api.github.com';
const REPO = `${GH_API}/repos/Diwala/config-cert-platform`;
const CONTENTS = `${REPO}/contents`;

// Enums
const Platform = {
  Web: 'web',
  Mobile: 'mobile',
};

const Environment = {
  Local: 'local',
  Dev: 'dev',
  Prod: 'prod',
};

// Configurations
const Configurations = [{
  platform: 'web',
  environment: 'dev',
  configs: [{
    source: `${CONTENTS}/frontend/dev/config.json`,
    destination: 'client/config.json',
    type: 'frontend',
  },
  {
    source: `${CONTENTS}/backend/dev/config.json`,
    destination: 'src/config.json',
    type: 'backend',
  }],
}];

/**
 * Get configuration settings for selected platform and environment
 *
 * @param {String} platform Platform
 * @param {[type]} environment
 * @return {[type]}
 */
const getConfigSettings = (platform, environment) => {
  const index = _.findIndex(Configurations, { platform, environment });
  return index === -1 ? null : Configurations[index];
};

module.exports = {
  REPO,
  Platform,
  Environment,
  getConfigSettings,
};
