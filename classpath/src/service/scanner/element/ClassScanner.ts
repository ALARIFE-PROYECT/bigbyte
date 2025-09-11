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
import { v4 } from 'uuid';
import Logger from '@bigbyte/utils/logger';

import { ClasspathElement, ClasspathElementType } from '../../../model/ClasspathElement';
import { ClasspathProperty } from '../../../model/ClasspathProperty';
import { ClasspathMethod } from '../../../model/ClasspathMethod';
import { ClasspathUtils } from '../ClasspathUtils';
import { PropertyScanner } from '../part/PropertyScanner';
import { MethodScanner } from '../part/MethodScanner';
import { LIBRARY_NAME } from '../../../constant';


const log = new Logger(LIBRARY_NAME);

export class ClassScanner {

  private classpathUtils: ClasspathUtils;

  private propertyScanner: PropertyScanner;

  private methodScanner: MethodScanner;

  constructor(classpathUtils: ClasspathUtils) {
    this.classpathUtils = classpathUtils;

    this.propertyScanner = new PropertyScanner();
    this.methodScanner = new MethodScanner();
  }

  public scan(file: SourceFile): ClasspathElement[] {
    const classElements: Array<ClasspathElement> = [];

    for (const cls of file.getClasses()) {
      const name = cls.getName() || '<anonymous>';
      this.classpathUtils.checkName(name);

      // log.dev('----------> CLASS Name:', name);

      const path = this.classpathUtils.getPath(file);

      const decorators = cls.getDecorators().map((d) => `@${d.getName()}`);

      const properties: ClasspathProperty[] = this.propertyScanner.scanProperties(cls);
      const methods: ClasspathMethod[] = this.methodScanner.scanMethods(cls);

      classElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.CLASS,
        rootPath: path.rootPath,
        outPath: path.outPath,
        decorators,
        properties,
        methods
      });
    }

    return classElements;
  }
}
