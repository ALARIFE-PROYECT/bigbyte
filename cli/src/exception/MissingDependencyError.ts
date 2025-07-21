export class MissingDependencyError extends Error {
  constructor(className: string, index: number) {
    super(`Missing injection token for parameter at index ${index} in class '${className}'`);
    this.name = 'MissingInjectionTokenError';
  }
}