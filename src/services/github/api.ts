import axios from 'axios';
import { getContentUrl, getGitTreeUrl, getRepoUrl, getUrl } from './urls';
import * as merge from 'merge-deep';

let token = ''

export const setToken = (passedInToken: string) => {
  token = passedInToken;
}

const request = async (extractUrlMethod: any, options?: any) => {
  const axiosDefaultOptions = {
    method: 'GET',
    url: extractUrlMethod(),
    headers: {
      Authorization: `token ${token}`,
    },
  }
  const mergedOptions = merge(axiosDefaultOptions, options);
  return await axios(mergedOptions);
}

export const getContent = async (repo: string, service: string, branch: string) => {
  try {
    return await request(getContentUrl.bind(this, repo, service, branch))
  } catch(e) {
    throw e
  }
}

export const getGitTree = async (repo: string, sha: string, branch:string) => {
  try {
    return await request(getGitTreeUrl.bind(this, repo, sha, branch))
  } catch(e) {
    throw e
  }
}

export const getFile = async (url: string) => {
  try {
    const requestParameters = {
      responseType: 'stream',
      headers: {
        Accept: 'application/vnd.github.v3.raw'
      }
    }
    return await request(getUrl.bind(this, url), requestParameters)
  } catch(e) {
    throw e
  }
}

export const validateToken = async (repo: string) => {
  try {
    return await request(getRepoUrl.bind(this, repo))
  } catch(e) {
    throw e
  }
}
