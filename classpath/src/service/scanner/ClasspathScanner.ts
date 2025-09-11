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

import { Project, SourceFile } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { ClasspathUtils } from './ClasspathUtils';
import { ClasspathElement } from '../../model/ClasspathElement';
import { ClassScanner } from './element/ClassScanner';
import { InterfaceScanner } from './element/InterfaceScanner';
import { EnumScanner } from './element/EnumScanner';
import { ReferenceStep } from './step/ReferenceStep';
import { LIBRARY_NAME } from '../../constant';

const log = new Logger(LIBRARY_NAME);

export class ClasspathScanner {
  private files: SourceFile[];

  private classpathElements: ClasspathElement[];

  /**
   * Scanners
   */
  private classScanner: ClassScanner;

  private interfaceScanner: InterfaceScanner;

  private enumScanner: EnumScanner;

  /**
   * Step
   */
  private referenceStep: ReferenceStep;

  constructor(tsPath: string, buildOutDir: string, buildRootDir: string) {
    const project = new Project({ tsConfigFilePath: tsPath });
    this.files = project.getSourceFiles(`${buildRootDir}/**/*.ts`);

    const utils = new ClasspathUtils(buildOutDir, buildRootDir);

    this.classScanner = new ClassScanner(utils);
    this.interfaceScanner = new InterfaceScanner(utils);
    this.enumScanner = new EnumScanner(utils);

    this.referenceStep = new ReferenceStep();

    this.classpathElements = [];
  }

  public scan(): ClasspathElement[] {
    for (const file of this.files) {
      const classElements = this.classScanner.scan(file);
      this.classpathElements.push(...classElements);

      const interfaceElements = this.interfaceScanner.scan(file);
      this.classpathElements.push(...interfaceElements);

      const enumElements = this.enumScanner.scan(file);
      this.classpathElements.push(...enumElements);
    }

    return this.referenceStep.resolveReferences(this.classpathElements);
  }
}
