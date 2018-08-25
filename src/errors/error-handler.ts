export class ErrorHandler extends Error {
  constructor(type = ErrorTypes.General, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorHandler);
    }

    this.type = type;
  }
}

export const ErrorTypes = {
  General: 'general',
  Service: 'service'
};
