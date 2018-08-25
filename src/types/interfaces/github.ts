export interface GitTreeLeafNode {
  path: string,
  mode: string,
  type: string,
  sha: string,
  size: number,
  url: string,
}

export interface GitContentsLinks {
  self: string,
  git: string,
  html: string
}

export interface GitContentsObject {
  name: string,
  path: string,
  sha: string,
  size: number,
  url: string,
  html_url: string,
  git_url: string,
  download_url: string,
  type: string
  _links: GitContentsLinks
}
