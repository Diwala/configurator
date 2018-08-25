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
export const getConfigs = async (token: string, env: string, repo: string, service: string, branch: string) => {
  initGithubService(token);
  try {
    const responseContent = await getContentFromRepo(repo, service, branch);
    const folder = responseContent.data.find((folder)=>{
      return folder.name === env;
    })

    const responseTree = await getGitTreeFromRepo(repo, folder.sha, branch);
    const files = responseTree.data.tree.filter((treeObject) => {
      return treeObject.type === 'blob'
    })

    const status = ora(`Downloading configuration file[s] for ${service}`).start();
    const fileStreams = files.map(async (file) => {
      const stream = await getFileFromRepo(file.url);
      const path = file.path;
      return { stream, path }
    })

    const resolvedFileStreams = await Promise.all(fileStreams);
    status.succeed()

    const fileResponse = resolvedFileStreams.map(async (stream) => {
      const newStatus = ora(`Saving config file to ${stream.path}`).start();
      try {
        const response = await pipeFile(stream, service);
        newStatus.succeed();
        return response
      } catch(e) {
        newStatus.fail(e.message)
        throw e
      }
    })
    const resolvedFileResponse = await Promise.all(fileResponse);


  } catch (error) {
    if(error.type === ErrorTypes.Service) {
      const stack = error.stack.split('\n').slice(1).join('\n');
      throw new CLIError(`${error.message} with status ${error.status} with trace ${stack}`);
    } else {
      throw error
    }
  }
};

const pipeFile = async (stream, service) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = fs.createWriteStream(stream.path);
      stream.stream.data.pipe(file);
      file.on('finish', () => {
        resolve();
      }).on('error', (err) => {
        reject({ status: 500, message: `Unable to save the ${service} config into ${stream.path}` });
      });
    } catch(e) {
      throw e
    }
  })
}
