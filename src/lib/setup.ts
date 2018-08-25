const fs = require('fs');
const axios = require('axios');
const { REPO } = require('./configs');
import { gitHub, gitTree, gitContents } from '../common/default-urls';

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

const getTreeUrl = (repo: string, sha: string, branch:string) => {
  return `${gitHub}/${repo}/${gitTree}/${folder.sha}?ref=${branch}&recursive=1`
}

const getContentUrl = (repo: string, service: string, branch:string) => {
  return `${gitHub}/${repo}/${gitContents}/${service}?ref=${branch}`
}

const getContent = async (token: string, repo: string, service: string, branch: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: getContentUrl(repo, service, branch),
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });
    console.log(response.data)
    return response
  }catch(e) {
    console.log('contents fail')
    console.log(e.config.url)
    console.log(e.toString())
    throw(e);
  }
}

/**
 * Download given file and store them on disk
 * @param {Object} fileObj File object containing information from where download and where to save
 * @param {String} fileObj.source Path to download file
 * @param {String} fileObj.destination Path to store downloaded file
 * @param {String} token Github API token
 */
const getConfigs = async (token: string, env: string, repo: string, service: string, branch: string) => {
  return new Promise(async (resolve) => {
    try {
      const response = await getContent(token, repo, service, branch)
      console.log(response)
      const folder = response.data.find((folder)=>{
        return folder.name === env;
      })
      const response2 = await axios({
        method: 'GET',
        url: getTreeUrl(repo, folder.sha, branch),
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      });
      console.log(response.data)
      console.log('------------------------------------------')
      console.log(response2.data)
      const files = response2.data.tree.filter((treeObject) => {
        return treeObject.type === 'blob'
      })
      console.log(files);

      // files.forEach(async (skyfile) => {
      //   const file = fs.createWriteStream(skyfile.path);
      //   try {
      //     const response3 = await axios({
      //       method: 'GET',
      //       // url: `https://api.github.com/repos/Diwala/config-cert-platform/contents/web_platform/${skyfile.path}?ref=config-improvement`,
      //       url:skyfile.url,
      //       headers: {
      //         Authorization: `token ${token}`,
      //         Accept: 'application/vnd.github.v3.raw',
      //       },
      //       responseType: 'stream',
      //     });
      //     if (response3) {
      //       response3.data.pipe(file);
      //       file.on('finish', () => {
      //         console.log('FINISHED')
      //       }).on('error', (err) => {
      //         console.log('ERRROR')
      //       });
      //     };
      //   } catch (e) {
      //     console.log(e)
      //   }

      // })
    } catch (error) {
      console.log(error.config.url)
      console.log(error.toString())
      // resolve({ status: 500, message: `Unable to download ${configObj.source}` });
    }
  });
};

module.exports = {
  validateToken,
  downloadFile,
  getConfigs
};
