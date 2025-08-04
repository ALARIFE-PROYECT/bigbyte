/**
 * ! Todavia no puedo reproducirlo
 */

import { componentRegistry } from "../container/ComponentRegistry";

export class CircularDependencyError extends Error {
    constructor(cycleId: string[]) {
      const cycle = cycleId.map(id => componentRegistry.getById(id).name).join(' -> ');

      super(`Circular dependency detected: ${cycle}`);
      this.name = 'CircularDependencyError';
    }
  }