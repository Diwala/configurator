const fs = require('fs');
const axios = require('axios');
import ServiceError from '../errors/service-error';
import { ErrorTypes } from '../errors/error-handler';
import {CLIError} from '@oclif/errors'
import {
  initGithubService,
  getContentFromRepo,
  getGitTreeFromRepo,
  getFileFromRepo,
  validateTokenOnRepo
} from '../services/github';

import * as ora  from 'ora';

/**
 * Validate Github API token
 *
 * @param {String} token Github API token
 */
export const validateToken = async (token:string, repo: string) => {
  initGithubService(token);
  try {
    const tokenValidateSpinner = ora('Validating Github API token.').start();
    const response = await validateTokenOnRepo(repo)
    if(response.status === 200) {
      tokenValidateSpinner.succeed('Github API token validated!');
    } else if(response.status === 500){
      tokenValidateSpinner.fail('Somethign is wrong');
    } else {
      tokenValidateSpinner.fail('Invalid Github API token.');
    }
  } catch (error) {
    if(error.type === ErrorTypes.Service) {
      const stack = error.stack.split('\n').slice(1).join('\n');
      throw new CLIError(`${error.message} with status ${error.status} with trace ${stack}`);
    } else {
      throw error
    }
  }
};

/**
 * Download given file and store them on disk
 * @param {Object} fileObj File object containing information from where download and where to save
 * @param {String} fileObj.source Path to download file
 * @param {String} fileObj.destination Path to store downloaded file
 * @param {String} token Github API token
 */
  initGithubService(token);

  return new Promise(async (resolve, reject) => {
    try {
      const responseContent = await getContentFromRepo(repo, service, branch);
      const folder = responseContent.data.find((folder)=>{
        return folder.name === env;
      })

      const responseTree = await getGitTreeFromRepo(repo, folder.sha, branch);
      const files = responseTree.data.tree.filter((treeObject) => {
        return treeObject.type === 'blob'
      })

      const fileStreams = files.map(async (file) => {
          const stream = await getFileFromRepo(file.url);
          const path = file.path.pathss.path;
          return { stream, path }
      })

      const resolvedFileStreams = await Promise.all(fileStreams);

      const fileResponse = resolvedFileStreams.forEach((stream) => {
        try {
          const file = fs.createWriteStream(stream.path);
          stream.stream.data.pipe(file);
          file.on('finish', () => {
            resolve({ status: 200, message: `Downloaded and saved the ${service} config into ${stream.path}` });
          }).on('error', (err) => {
            reject({ status: 500, message: `Unable to save the ${service} config into ${stream.path}` });
          });
        } catch(e) {
          throw e
        }
      })
    } catch (error) {
      if(error.type === ErrorTypes.Service) {
        const stack = error.stack.split('\n').slice(1).join('\n');
        reject(new CLIError(`${error.message} with status ${error.status} with trace ${stack}`))
      } else {
        reject(error)
      }
    }
  });
};

module.exports = {
  validateToken,
  downloadFile,
  getConfigs
};
