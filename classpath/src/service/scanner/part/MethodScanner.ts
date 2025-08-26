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
      // console.log('||||||||||||| METHOD Name:', method.getName());

      let decorators: string[] = [];
      if ('getDecorators' in method) {
        decorators = method.getDecorators().map((d) => `@${d.getName()}`);
      }

      const parameters: ClasspathProperty[] = method.getParameters().map((param) => {
        // console.log(')))))))))))) PARAM Name:', param.getName());
        const paramDecorators = param.getDecorators().map((d) => `@${d.getName()}`);
        const type = this.typeScanner.getType(param.getType());

        return {
          name: param.getName(),
          type: type,
          decorators: paramDecorators
        };
      });

      // console.log(')))))))))))) RETURN');
      const returnType = this.typeScanner.getType(method.getReturnType());

      return {
        name: method.getName(),
        decorators,
        parameters,
        returnType: returnType
      };
    });
  }
}
