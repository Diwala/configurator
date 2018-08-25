import { RootError, ErrorTypes } from './error'

export default class ServiceError extends RootError {
  constructor(err, readableMessage = null, status = 500) {
    super(ErrorTypes.Service, readableMessage);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }

    this.status = status;
  }
}
