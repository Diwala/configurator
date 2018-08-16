const fs = require('fs');
const request = require('request');
const { REPO } = require('./configs');

/**
 * Validate Github API token
 *
 * @param {String} token Github API token
 * @param {Function} cb Callback function
 */
const validateToken = (token, cb) => {
  request.get({
    url: REPO,
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'request',
    },
  }, (err, res) => {
    if (err) {
      cb(err, { status: 400, message: 'Unable to receive a response. Probably a network issue!' });
    } else if (res.statusCode === 200) {
      cb(null, { status: res.statusCode, message: 'Github API token validated!' });
    } else if (res.statusCode === 401) {
      cb(err, { status: res.statusCode, message: 'Invalid Github API token.' });
    }
  });
};

/**
 * Download given file and store them on disk
 * @param {Object} fileObj File object containing information from where download and where to save
 * @param {String} fileObj.source Path to download file
 * @param {String} fileObj.destination Path to store downloaded file
 * @param {String} token Github API token
 * @param {Function} cb Callback function
 */
const downloadFile = (fileObj, token, cb) => {
  const file = fs.createWriteStream(fileObj.destination);
  request.get({
    url: fileObj.source,
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'request',
      Accept: 'application/vnd.github.v3.raw',
    },
  }, (err) => {
    if (err) {
      cb(err, { status: 400, message: `Unable to download ${fileObj.source}` });
    }
  }).pipe(file);

  file.on('finish', () => {
    cb(null, { status: 200, message: `Downloaded and saved the ${fileObj.type} config into ${fileObj.destination}` });
  }).on('error', (err) => {
    cb(err, { status: 500, message: `Unable to save the ${fileObj.type} config into ${fileObj.destination}` });
  });
};

module.exports = {
  validateToken,
  downloadFile,
};
