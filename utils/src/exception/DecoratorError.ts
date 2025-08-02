export class DecoratorError extends Error {
    constructor(description: string) {
      super(description);
      this.name = 'DecoratorError';
    }
  }