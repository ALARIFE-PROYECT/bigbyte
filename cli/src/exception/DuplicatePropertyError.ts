export class DuplicatePropertyError extends Error {
    constructor(property: string, origin: string) {
      super('Duplicate property found: ' + property + ' in ' + origin);
      this.name = 'DuplicatePropertyError';
    }
  }