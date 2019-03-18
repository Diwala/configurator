import { AxiosResponse } from 'axios';
import { Stream } from '../types/interfaces/stream';
import { GitTreeLeafNode } from '../types/interfaces/github';
import * as fs from 'fs';

const noFileOrDirectoryFound = 'ENOENT';

export const initiateStreams = async (files: GitTreeLeafNode[], streamGetterFunc:Function) => {
  const fileStreams = files.map(async (file: GitTreeLeafNode) => {
    const stream = await streamGetterFunc(file.url);
    const path = file.path;
    return { stream, path }
  })

  return await Promise.all(fileStreams);
}

export const pipeFiles = async (commanderFeedback:Function, resolvedFileStreams: any):Promise<boolean[]> => {
  const filePromises = resolvedFileStreams.map(async (stream: Stream) => {
    const status = commanderFeedback(stream);
    try {
      const response = await pipeFile(stream);
      status.succeed();
      return response
    } catch(e) {
      if(e.code === noFileOrDirectoryFound) {
        status.info(`Ignoring ${stream.path}, because cant find folders for location`);
        return {}
      } else {
        status.fail(e.message);
        throw e;
      }
    }
  })
  return await Promise.all<boolean>(filePromises);
}

const pipeFile = ({stream, path}: Stream) => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.createWriteStream(path);
      stream.data.pipe(file);
      file.on('finish', () => {
        resolve(true);
      }).on('error', (err) => {
        reject(err);
      });
    } catch(e) {
      reject(e)
    }
  })
}
