import coreRegistry from '../container/CoreComponentRegistry';

/**
 * ! Todavia no puedo reproducirlo
 */

export class CircularDependencyError extends Error {
    constructor(cycleId: string[]) {
      const cycle = cycleId.map(id => coreRegistry.getById(id).name).join(' -> ');

      super(`Circular dependency detected: ${cycle}`);
      this.name = 'CircularDependencyError';
    }
  }