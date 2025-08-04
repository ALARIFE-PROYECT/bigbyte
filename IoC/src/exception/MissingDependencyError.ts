export class MissingDependencyError extends Error {
  constructor(dependency: string | Function) {
    if (typeof dependency === 'function') {
      super(`The dependency ${dependency.name} cannot be found. The error may be due to its nonexistence, its injectability, or a circular dependency.`)
    } else if (typeof dependency === 'string') {
      super(`Dependency with id ${dependency} not found.`)
    } else {
      super(`The ${dependency} dependency is missing.`);
    }

    this.name = 'MissingDependencyError';
  }
}