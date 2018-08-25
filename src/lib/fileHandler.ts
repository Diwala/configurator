import { AxiosResponse } from 'axios';
import * as fs from 'fs';

export const initiateStreams = async (files, streamGetterFunc) => {
  const fileStreams = files.map(async (file) => {
    const stream = await streamGetterFunc(file.url);
    const path = file.path;
    return { stream, path }
  })

  return await Promise.all(fileStreams);
}

export const pipeFiles = async (commanderFeedback, resolvedFileStreams) => {
  const filePromises = resolvedFileStreams.map(async (stream: Stream) => {
    const status = commanderFeedback(stream);
    try {
      const response = await pipeFile(stream);
      status.succeed();
      return response
    } catch(e) {
      status.fail(e.message)
      throw e
    }
  })
  return await Promise.all(filePromises);
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
