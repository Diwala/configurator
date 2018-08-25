export class RootError extends Error {
  type: string;
  constructor(type = ErrorTypes.General, ...params:any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RootError);
    }

    this.type = type;
  }
}

export const ErrorTypes = {
  General: 'general',
  Service: 'service'
};
