const axios = require('axios');
const fs = require('fs');
const request = require('request');
const { REPO } = require('./configs');

const validateToken = async (token) => {
  try {
    const response = await request({
      url: REPO,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'request'
      }
    });
    console.log(response);
    return {status: response.status, message: 'Github API token validated!'};
  } catch (e) {
    if (e.response.status === 401 || e.response.status === 403) {
      return {status: 403, message: 'Invalid Github API token.'};
    } else {
      return {status: 401, message: 'Unable to receive a response. Probably a network issue!'};
    }
  }
};

const downloadFile = async (config, token) => {
  console.log(config)
  try {
    request.get({
      url: config.source,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'request',
        'Accept': 'application/vnd.github.v3.raw'
      }
    }).pipe(fs.createWriteStream(config.destination));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  validateToken,
  downloadFile
};
