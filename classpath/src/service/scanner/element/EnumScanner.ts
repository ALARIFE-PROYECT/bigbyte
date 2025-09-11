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

import { ClasspathElement, ClasspathElementType, ClasspathEnumType } from '../../../model/ClasspathElement';
import { ClasspathUtils } from '../ClasspathUtils';
import { LIBRARY_NAME } from '../../../constant';



const log = new Logger(LIBRARY_NAME);

export class EnumScanner {
  private classpathUtils: ClasspathUtils;


  constructor(classpathUtils: ClasspathUtils) {
    this.classpathUtils = classpathUtils;
  }

  public scan(file: SourceFile): ClasspathElement[] {
    const enumElements: Array<ClasspathElement> = [];

    for (const enumDecl of file.getEnums()) {
      const name = enumDecl.getName();
      const path = this.classpathUtils.getPath(file);
      const values: Array<ClasspathEnumType> = [];

      enumDecl.getMembers().forEach((member) => {
        const name = member.getName();
        // log.dev('----------> ENUM Name:', name);

        let value: string;
        if (member.getInitializer()) {
          const initializer = member.getInitializer()!;
          const literalValue = initializer.getText();

          if (/^\d+$/.test(literalValue)) {
            value = literalValue;
          } else if (
            (literalValue.startsWith('"') && literalValue.endsWith('"')) ||
            (literalValue.startsWith("'") && literalValue.endsWith("'"))
          ) {
            value = literalValue.slice(1, -1);
          } else {
            value = literalValue;
          }
        } else {
          value = enumDecl.getMembers().indexOf(member).toString();
        }

        values.push({ name, value });
      });

      enumElements.push({
        id: v4(),
        name,
        rootPath: path.rootPath,
        outPath: path.outPath,
        type: ClasspathElementType.ENUM,
        values
      });
    }

    return enumElements;
  }
}
