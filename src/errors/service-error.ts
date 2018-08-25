const ErrorHandler = require('./error-handler').ErrorHandler;
const ErrorTypes = require('./error-handler').ErrorTypes;

export default class ServiceError extends ErrorHandler {
  constructor(err, readableMessage = null, status = 500) {
    super(ErrorTypes.Service, readableMessage);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
    
    this.status = status;
  }
}
