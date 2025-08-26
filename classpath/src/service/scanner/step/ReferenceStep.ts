import Logger from '@bigbyte/utils/logger';
import { ClasspathElement, ClasspathElementType } from '../../../model/ClasspathElement';
import { ClasspathType } from '../../../model/ClasspathType';
import { LIBRARY_NAME } from '../../../constant';

const log = new Logger(LIBRARY_NAME);

export class ReferenceStep {
  private elements: Array<ClasspathElement> = [];

  constructor() {}

  private searchReference(type: ClasspathType): string {
    let ref = type.ref!;
    if (ref.startsWith('import(')) {
      const referencedElement = this.elements.find((e) => e.name === type.name);
      if (referencedElement) {
        type.ref = referencedElement.id;
      }
    }

    return ref;
  }

  private getReference(type: ClasspathType): void {
    if (type.kind === 'union') {
      type.types?.forEach((t) => this.getReference(t));
    } else if (type.kind === 'intersection') {
      type.types?.forEach((t) => this.getReference(t));
    } else if (type.kind === 'alias') {
      type.arguments?.forEach((t) => this.getReference(t));
    } else if (type.kind === 'array') {
      this.getReference(type.elementType!);
    } else if (type.kind === 'object') {
      if(type.generic) {
        type.generic.forEach((g) => this.getReference(g));
      } else {
        this.searchReference(type);
      }
    } else if (type.kind === 'inline-object') {
      type.properties?.forEach((p) => this.getReference(p.type));
    } else if (type.kind === 'enum') {
      this.searchReference(type);
    } else if (type.kind === 'primitive') {
      type.text = type.text!.replace(/^"(.*)"$/, '$1');
    }
  }

  public resolveReferences(elements: Array<ClasspathElement>): ClasspathElement[] {
    this.elements = elements;

    elements.forEach((element: ClasspathElement) => {
      // Enum no tiene type, asi que no se puee referenciar
      if (element.type === ClasspathElementType.CLASS) {
        element.properties?.forEach((property) => this.getReference(property.type));
        element.methods?.forEach((method) => {
          method.parameters.forEach((param) => this.getReference(param.type));
          this.getReference(method.returnType);
        });
      } else if (element.type === ClasspathElementType.INTERFACE) {
        element.properties?.forEach((property) => this.getReference(property.type));
        element.methods?.forEach((method) => {
          method.parameters.forEach((param) => this.getReference(param.type));
          this.getReference(method.returnType);
        });
      } else if (element.type === ClasspathElementType.FUNCTION) {
        element.parameters?.forEach((property) => this.getReference(property.type));
        this.getReference(element.returnType!);
      }
    });

    return elements;
  }
}
