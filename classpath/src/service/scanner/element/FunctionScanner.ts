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

import { SourceFile } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { LIBRARY_NAME } from '../../../constant';


const log = new Logger(LIBRARY_NAME);

export class FunctionScanner {
  constructor() {}

  public scan(file: SourceFile) {
    for (const func of file.getFunctions()) {
      const name = func.getName() || '<anonymous>';

      // TODO: almacenar tambien funciones sueltas
      // * Se usara para los middlewares y funciones de utilidad
    }
  }
}
