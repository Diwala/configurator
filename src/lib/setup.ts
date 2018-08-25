import {
  initGithubService,
  getContentFromRepo,
  getGitTreeFromRepo,
  getFileFromRepo,
  validateTokenOnRepo
} from '../services/github';
import { checkTypeAndAppropriateThrowCliError } from '../errors/helpers'
import { pipeFiles, initiateStreams } from './fileHandler';

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
      tokenValidateSpinner.fail('Something is wrong');
    } else {
      tokenValidateSpinner.fail('Invalid Github API token.');
    }
  } catch (error) {
    checkTypeAndAppropriateThrowCliError(error);
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
    const resolvedFileStreams = await initiateStreams(files, getFileFromRepo);
    status.succeed()

    const commanderMessage = (stream: any) => {
      return ora(`Saving config file to ${stream.path}`).start()
    }
    const pipedFilesResponse = await pipeFiles(commanderMessage, resolvedFileStreams);
    return pipedFilesResponse.every((res) => res===true)

  } catch (error) {
    checkTypeAndAppropriateThrowCliError(error);
  }
};
