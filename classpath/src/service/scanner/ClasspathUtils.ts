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

import path from 'node:path';
import { SourceFile } from 'ts-morph';
import { ROOT_PATH } from '@bigbyte/utils/constant';

import { DuplicateClassError } from '../../exception';

export interface Paths {
  rootPath: string;
  outPath: string;
}

export class ClasspathUtils {
  private buildOutDir: string;

  private buildRootDir: string;

  private classControlName: Set<string>;

  constructor(buildOutDir: string, buildRootDir: string) {
    this.buildOutDir = buildOutDir;
    this.buildRootDir = buildRootDir;

    this.classControlName = new Set<string>();
  }

  public getPath(file: SourceFile): Paths {
    const rootPath = path.resolve(file.getFilePath());
    const classRelativePath = rootPath.replace(path.join(ROOT_PATH, this.buildRootDir), '');
    const outPath = path.join(ROOT_PATH, this.buildOutDir, classRelativePath.replace('.ts', '.js'));

    return { rootPath, outPath };
  }

  public checkName(name: string): void {
    if(name.includes('anonymous')) {
      return;
    }

    if (this.classControlName.has(name)) {
      throw new DuplicateClassError(`Duplicate class or interface names are not allowed. Name detected: ${name}`);
    }
    this.classControlName.add(name);
  }
}
