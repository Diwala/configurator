const fs = require('fs');
const axios = require('axios');
const { REPO } = require('./configs');

/**
 * Validate Github API token
 *
 * @param {String} token Github API token
 */
const validateToken = async (token: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: REPO,
      headers: {
        Authorization: `token ${token}`,
      },
    });
    if (response.status === 200) {
      return { status: response.status, message: 'Github API token validated!' };
    }
    return { status: response.status, message: 'Something isn\'n right! :(' };
  } catch (error) {
    if (!error.response) {
      return { status: 500, message: 'Didn not receive a response. Probably a network issue!' };
    }
    return { status: error.response.status, message: 'Invalid Github API token.' };
  }
};

/**
 * Download given file and store them on disk
 * @param {Object} fileObj File object containing information from where download and where to save
 * @param {String} fileObj.source Path to download file
 * @param {String} fileObj.destination Path to store downloaded file
 * @param {String} token Github API token
 */
const downloadFile = async (configObj: any, token: string) => {
  const file = fs.createWriteStream(configObj.destination);
  return new Promise(async (resolve) => {
    try {
      const response = await axios({
        method: 'GET',
        url: configObj.source,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.raw',
        },
        responseType: 'stream',
      });
      if (response) {
        response.data.pipe(file);
        file.on('finish', () => {
          resolve({ status: 200, message: `Downloaded and saved the ${configObj.type} config into ${configObj.destination}` });
        }).on('error', () => {
          resolve({ status: 500, message: `Unable to save the ${configObj.type} config into ${configObj.destination}` });
        });
      }
    } catch (error) {
      resolve({ status: 500, message: `Unable to download ${configObj.source}` });
    }
  });
};

module.exports = {
  validateToken,
  downloadFile,
};
