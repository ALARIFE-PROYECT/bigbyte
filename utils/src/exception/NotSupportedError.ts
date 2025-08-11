export class NotSupportedError extends Error {
    constructor(description: string) {
      super(description);
      this.name = 'DecoratorError';
    }
  }