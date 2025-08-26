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
