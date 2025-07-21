export class MissingComponentRegistryError extends Error {
    constructor() {
      super('The component registration is missing. You must decorate your main class with the @App decorator.');
      this.name = 'MissingComponentRegistryError';
    }
  }