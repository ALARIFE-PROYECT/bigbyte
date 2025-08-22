import { Type } from 'ts-morph';
import { ClasspathType } from '../../../model/ClasspathType';
import { ClasspathElement } from '../../../model/ClasspathElement';
// import { ClasspathType } from '../../model/ClasspathType';

export class ClasspathScannerType {
  constructor() {}

  // private cleanTypeText(typeText: string): string {
  //   return typeText.replace(/import\(["'][^)]+["']\)\./g, '');
  // }

  public getType(type: Type): ClasspathType {
    //! no detecta el union con enum, siempre devuelve otro 
    // * si poner role: UserRole | string => siempre detecta como primitive string

    const symbol = type.getSymbol();
    const aliasSymbol = type.getAliasSymbol();

    if (type.isEnum() || type.isEnumLiteral()) {
      // console.log('ENUM -------------> ', symbol?.getName());

      return { kind: 'enum', name: symbol?.getName(), ref: type.getText() };
    }

    if (type.isUnion()) {
      // console.log('UNION -------------> ', type.getText());
      return { kind: 'union', types: type.getUnionTypes().map((t) => this.getType(t)) };
    }

    if (type.isIntersection()) {
      // console.log('INTERSECTION -------------> ', type.getText());
      return { kind: 'intersection', types: type.getIntersectionTypes().map((t) => this.getType(t)) };
    }

    if (type.isArray()) {
      const elementType = type.getArrayElementTypeOrThrow();
      return { kind: 'array', type: this.getType(elementType) };
    }

    if (type.isObject() && !type.getSymbol()) {
      console.log('OBJECT WITHOUT SYMBOL -------------> ', type.getText());
      return {} as ClasspathType; // TODO: Implement object type handling
    }

    if (aliasSymbol) {
      const name = aliasSymbol.getName();

      return {
        kind: 'alias',
        name,
        arguments: type.getAliasTypeArguments().map((t) => this.getType(t))
      };
    }

    if (type.isObject()) {
      const name = symbol?.getName();
      if (!symbol || name === '__type' || name === '__object') {
        return {
          kind: 'inline-object',
          properties: type.getProperties().map((p) => ({
            name: p.getName(),
            type: this.getType(p.getTypeAtLocation(p.getValueDeclaration()!))
          }))
        };
      }

      if (symbol) {
        return {
          kind: 'object',
          name: symbol.getName(),
          ref: type.getText()
        };
      }
    }

    return { kind: 'primitive', text: type.getText() };
  }
}
