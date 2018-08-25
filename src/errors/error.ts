export class RootError extends Error {
  constructor(type = ErrorTypes.General, ...params) {
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
