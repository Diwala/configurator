const gitHub = 'https://api.github.com/repos';
const gitTree = 'git/trees';
const gitContents = 'contents';

export const getContentUrl = (repo: string, service: string, branch:string) => {
  return `${gitHub}/${repo}/${gitContents}/${service}?ref=${branch}`
}

export const getGitTreeUrl = (repo: string, sha: string, branch:string) => {
  return `${gitHub}/${repo}/${gitTree}/${sha}?ref=${branch}&recursive=1`
}

export const getRepoUrl = (repo:string) => {
  return `${gitHub}/${repo}`
}

export const getUrl = (url:string) => {
  return url+'feiell/feil';
}
