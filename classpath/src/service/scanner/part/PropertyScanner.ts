/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/classpath.
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

import { ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { TypeScanner } from './TypeScanner';
import { LIBRARY_NAME } from '../../../constant';

const log = new Logger(LIBRARY_NAME);

export class PropertyScanner {
  private typeScanner: TypeScanner;

  constructor() {
    this.typeScanner = new TypeScanner();
  }

  public scanProperties(element: ClassDeclaration | InterfaceDeclaration) {
    return element.getProperties().map((prop) => {
      const name = prop.getName();
      // log.dev('-----> PROPERTY Name:', name);

      let decorators: string[] = [];
      if ('getDecorators' in prop) {
        decorators = prop.getDecorators().map((d) => `@${d.getName()}`);
      }

      const type = this.typeScanner.getType(prop.getType(), prop.getTypeNode());

      return {
        name,
        type,
        decorators
      };
    });
  }
}
