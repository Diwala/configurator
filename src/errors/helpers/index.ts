import { ErrorTypes } from '../error'

export const checkTypeAndAppropriateThrowCliError = (error: Error) => {
  if(error.type === ErrorTypes.Service) {
    const stack = error.stack.split('\n').slice(1).join('\n');
    throw new CLIError(`${error.message} with status ${error.status} with trace ${stack}`);
  } else {
    throw error
  }
}
