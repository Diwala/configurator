const GH_API = 'https://api.github.com';
const REPO = `${GH_API}/repos/Diwala/config-cert-platform`;
const CONTENTS = `${REPO}/contents`;

const configs = [
  { platform: 'WEB', environment: 'DEV', configs: [
    { source: `${CONTENTS}/frontend/dev/config.json`, destination: `client/config.json` },
    { source: `${CONTENTS}/backend/dev/config.json`, destination: `src/config.json` }
  ] }
];

module.exports = {
  REPO,
  configs
};
