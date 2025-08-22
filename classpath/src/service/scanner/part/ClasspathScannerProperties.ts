import { ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import { ClasspathScannerType } from './ClasspathScannerType';

export class ClasspathScannerProperties {
  private classpathScannerType: ClasspathScannerType;

  constructor() {
    this.classpathScannerType = new ClasspathScannerType();
  }

  public scanProperties(element: ClassDeclaration | InterfaceDeclaration) {
    return element.getProperties().map((prop) => {
      // console.log('||||||||||||| PROPERTY Name:', prop.getName());

      let decorators: string[] = [];
      if ('getDecorators' in prop) {
        decorators = prop.getDecorators().map((d) => `@${d.getName()}`);
      }

      const type = this.classpathScannerType.getType(prop.getType());
      // console.log('🚀 ~ ClasspathScanner ~ getProperties ~ type:', JSON.stringify(type));

      return {
        name: prop.getName(),
        type,
        decorators
      };
    });
  }
}
