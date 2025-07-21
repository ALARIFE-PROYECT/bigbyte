export class MissingConfigurationError extends Error {
    constructor(fileName: string, configuration: string, valueRequired?: string) {
      let message;
  
      if (valueRequired) {
        message = `Missing configurations in ${fileName}. The ${configuration} setting must have the value ${valueRequired}.`;
      } else {
        message = `Missing configurations in ${fileName}. The ${configuration} setting is required.`;
      }
  
      super(message);
  
      this.name = 'MissingConfigurationsTsConfigError';
    }
  }