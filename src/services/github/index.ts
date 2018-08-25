import { getContent, getGitTree, getFile, setToken, validateToken } from './api'
import ServiceError from '../../errors/service-error';

const parseError = (e: Error, message: string) => {
  if(e.response && e.response.status && e.response.config) {
    const status = e.response.status
    const compiledMessage = `${message} ${e.config.url}`
    const error = new ServiceError(e, compiledMessage, status)
    return error
  } else {
    return e
  }
}

export const initGithubService = (token: string) => {
  setToken(token)
}

export const getContentFromRepo = async (repo: string, service: string, branch: string) => {
  try {
    return await getContent(repo, service, branch);
  } catch(e) {
    throw parseError(e, `External service to gitContents failed on`)
  }
}

export const getGitTreeFromRepo = async (repo:string, sha: string, branch: string) => {
  try {
    return await getGitTree(repo, sha, branch);
  } catch(e) {
    throw parseError(e, `External service call to gitTree failed on`);
  }
}

export const getFileFromRepo = async (url: string) => {
  try {
    return await getFile(url);
  } catch(e) {
    throw parseError(e, `External service call to get file as stream failed on`);
  }
}

export const validateTokenOnRepo = async (repo: string) => {
  try {
    return await validateToken(repo);
  } catch(e) {
    throw parseError(e, `Token invalid`);
  }
}
