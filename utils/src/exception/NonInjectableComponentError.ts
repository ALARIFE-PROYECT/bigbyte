export class NonInjectableComponentError extends Error {
    constructor(name: string) {
      super(`Component ${name} is not injectable.`);
      this.name = 'NonInjectableComponentError';
    }
  }