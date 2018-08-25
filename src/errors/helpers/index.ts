import { ErrorTypes, RootError } from '../error'
import { CLIError } from '@oclif/errors'
import ServiceError from '../service-error'

export const checkTypeAndAppropriateThrowCliError = (error: ServiceError | RootError) => {
  if(error.type === ErrorTypes.Service) {
    const stack = error.stack ? error.stack.split('\n').slice(1).join('\n') : '';
    throw new CLIError(`${error.message} with status ${(<ServiceError>error).status} with trace ${stack}`);
  } else {
    throw error
  }
}
