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

export type KindType = 'union' | 'intersection' | 'alias' | 'array' | 'object' | 'inline-object' | 'enum' | 'primitive';

export interface PropertyType {
  name: string;
  type: ClasspathType;
}

export interface ClasspathType {
  kind: KindType;

  /**
   * Union o Intersection
   */
  types?: ClasspathType[];

  /**
   * primitive
   */
  text?: string;

  /**
   * alias
   */
  name?: string;
  arguments?: ClasspathType[];

  /**
   * Object o enum
   */
  ref?: string;
  generic?: ClasspathType[]; // tipo generico, si el tipo contiene un subtype generico el realmente es el objetivo

  /**
   * inline-object
   */
  properties?: PropertyType[];

  /**
   * array
   */
  elementType?: ClasspathType;
}
