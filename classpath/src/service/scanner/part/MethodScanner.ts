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

import { ClassDeclaration, InterfaceDeclaration } from "ts-morph";
import Logger from '@bigbyte/utils/logger';

import { ClasspathMethod } from "../../../model/ClasspathMethod";
import { ClasspathProperty } from "../../../model/ClasspathProperty";
import { TypeScanner } from "./TypeScanner";
import { LIBRARY_NAME } from "../../../constant";


const log = new Logger(LIBRARY_NAME);

export class MethodScanner {

  private typeScanner: TypeScanner;

  constructor() {
    this.typeScanner = new TypeScanner();
  }

  public scanMethods(element: ClassDeclaration | InterfaceDeclaration): ClasspathMethod[] {
    return element.getMethods().map((method) => {
      const methodName = method.getName();
      // log.dev('-----> METHOD Name:', methodName);

      let decorators: string[] = [];
      if ('getDecorators' in method) {
        decorators = method.getDecorators().map((d) => `@${d.getName()}`);
      }

      const parameters: ClasspathProperty[] = method.getParameters().map((param) => {
        const name = param.getName();
        // log.dev('---> PARAM Name:', name);
        const paramDecorators = param.getDecorators().map((d) => `@${d.getName()}`);
        const type = this.typeScanner.getType(param.getType());

        return {
          name,
          type: type,
          decorators: paramDecorators
        };
      });

      // log.dev('---> RETURN: ');
      const returnType = this.typeScanner.getType(method.getReturnType());

      return {
        name: methodName,
        decorators,
        parameters,
        returnType: returnType
      };
    });
  }
}
