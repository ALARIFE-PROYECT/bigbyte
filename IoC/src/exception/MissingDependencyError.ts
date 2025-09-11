/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/ioc.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

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