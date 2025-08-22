import { ClassDeclaration, InterfaceDeclaration } from "ts-morph";
import { ClasspathMethod } from "../../../model/ClasspathMethod";
import { ClasspathProperty } from "../../../model/ClasspathProperty";
import { ClasspathScannerType } from "./ClasspathScannerType";

export class ClasspathScannerMethods {

  private classpathScannerType: ClasspathScannerType;

  constructor() {
    this.classpathScannerType = new ClasspathScannerType();
  }

  public scanMethods(element: ClassDeclaration | InterfaceDeclaration): ClasspathMethod[] {
    return element.getMethods().map((method) => {
      // console.log('||||||||||||| METHOD Name:', method.getName());

      let decorators: string[] = [];
      if ('getDecorators' in method) {
        decorators = method.getDecorators().map((d) => `@${d.getName()}`);
      }

      const parameters: ClasspathProperty[] = method.getParameters().map((param) => {
        // console.log('||||||||||||| PARAM Name:', param.getName());
        const paramDecorators = param.getDecorators().map((d) => `@${d.getName()}`);
        const type = this.classpathScannerType.getType(param.getType());

        return {
          name: param.getName(),
          type: type,
          decorators: paramDecorators
        };
      });

      // console.log('||||||||||||| RETURN');
      const returnType = this.classpathScannerType.getType(method.getReturnType());

      return {
        name: method.getName(),
        decorators,
        parameters,
        returnType: returnType
      };
    });
  }
}
