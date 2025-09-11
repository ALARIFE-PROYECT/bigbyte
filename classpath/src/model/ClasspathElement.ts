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

import { ClasspathMethod } from './ClasspathMethod';
import { ClasspathProperty } from './ClasspathProperty';
import { ClasspathType } from './ClasspathType';

export enum ClasspathElementType {
  CLASS = 'CLASS',
  INTERFACE = 'INTERFACE',
  ENUM = 'ENUM',
  FUNCTION = 'FUNCTION'
}

export interface ClasspathEnumType {
  name: string;
  value: string;
}

export interface ClasspathElement {
  id: string;
  name: string;
  rootPath: string; // ruta absoluta del archivo ts
  outPath: string; // ruta absoluta del archivo js
  type: ClasspathElementType;
  

  decorators?: string[]; // usado en Class y Function

  /** Class & Interface */
  properties?: ClasspathProperty[];
  methods?: ClasspathMethod[];

  /** Enum */
  values?: ClasspathEnumType[];

  /** Function */
  parameters?: ClasspathProperty[];
  returnType?: ClasspathType;
}
