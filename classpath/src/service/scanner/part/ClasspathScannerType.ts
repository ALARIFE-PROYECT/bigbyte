import { SyntaxKind, Type, TypeAliasDeclaration, TypeNode } from 'ts-morph';
import { ClasspathType } from '../../../model/ClasspathType';

export class ClasspathScannerType {
  constructor() {}

  // private cleanTypeText(typeText: string): string {
  //   return typeText.replace(/import\(["'][^)]+["']\)\./g, '');
  // }

  public getType(type: Type, typeNode?: TypeNode): ClasspathType {
    const symbol = type.getSymbol();
    const aliasSymbol = type.getAliasSymbol();

    // Busqueda del TypeNode si existiera
    if (symbol) {
      const declarations = symbol.getDeclarations();
      if (declarations.length > 0) {
        const declaration = declarations[0];
        if (declaration.getKind() === SyntaxKind.TypeAliasDeclaration) {
          typeNode = (declaration as TypeAliasDeclaration).getTypeNode();
        }
      }
    }

    /** Enum | Alias | Object */
    if (typeNode && typeNode.getKind() === SyntaxKind.TypeReference) {
      const typeRefNode = typeNode.asKindOrThrow(SyntaxKind.TypeReference);
      const typeName = typeRefNode.getTypeName().getText();
      const typeArgs = typeRefNode.getTypeArguments();

      if (
        symbol &&
        symbol.getName() === typeName &&
        symbol.getDeclarations().some((d) => d.getKind() === SyntaxKind.EnumDeclaration)
      ) {
        // console.log('ENUM NODE -------------> ', symbol?.getName());
        return { kind: 'enum', name: symbol?.getName(), ref: type.getText() };
      } else if (typeArgs.length > 0) {
        // console.log('ALIAS NODE -------------> ', type.getText());

        return {
          kind: 'alias',
          name: typeName,
          arguments: typeArgs.map((t) => this.getType(t.getType(), t))
        };
      } else {
        // console.log('OBJECT NODE -------------> ', type.getText());
        return {
          kind: 'object',
          name: typeName,
          ref: type.getText()
        };
      }
    } else if (type.isEnum() || type.isEnumLiteral()) {
      // console.log('ENUM -------------> ', symbol?.getName());
      return { kind: 'enum', name: symbol?.getName(), ref: type.getText() };
    }

    /** UNION */
    if (typeNode && typeNode.getKind() === SyntaxKind.UnionType) {
      // console.log('UNION NODE -------------> ', typeNode.getText());
      const unionNode = typeNode.asKindOrThrow(SyntaxKind.UnionType);
      return {
        kind: 'union',
        types: unionNode.getTypeNodes().map((n) => this.getType(n.getType(), n))
      };
    } else if (type.isUnion()) {
      // console.log('UNION -------------> ', type.getText());
      return { kind: 'union', types: type.getUnionTypes().map((t) => this.getType(t)) };
    }

    /** INTERSECTION */
    if (typeNode && typeNode.getKind() === SyntaxKind.IntersectionType) {
      // console.log('INTERSECTION NODE -------------> ', type.getText());
      const intersectionNode = typeNode.asKindOrThrow(SyntaxKind.IntersectionType);
      return {
        kind: 'intersection',
        types: intersectionNode.getTypeNodes().map((n) => this.getType(n.getType(), n))
      };
    } else if (type.isIntersection()) {
      // console.log('INTERSECTION -------------> ', type.getText());
      return { kind: 'intersection', types: type.getIntersectionTypes().map((t) => this.getType(t)) };
    }

    /** Array */
    if (typeNode && typeNode.getKind() === SyntaxKind.ArrayType) {
      const arrayNode = typeNode.asKindOrThrow(SyntaxKind.ArrayType);
      const elementType = arrayNode.getElementTypeNode();

      return { kind: 'array', type: this.getType(elementType.getType(), elementType) };
    } else if (type.isArray()) {
      const elementType = type.getArrayElementTypeOrThrow();
      return { kind: 'array', type: this.getType(elementType) };
    }

    if (aliasSymbol) {
      // console.log('ALIAS -------------> ', type.getText());
      return {
        kind: 'alias',
        name: aliasSymbol.getName(),
        arguments: type.getAliasTypeArguments().map((t) => this.getType(t))
      };
    }

    if (type.isObject()) {
      const name = symbol?.getName();
      if (!symbol || name === '__type' || name === '__object') {
        // console.log('INLINE OBJECT -------------> ', type.getText());

        return {
          kind: 'inline-object',
          properties: type.getProperties().map((p) => ({
            name: p.getName(),
            type: this.getType(p.getTypeAtLocation(p.getValueDeclaration()!))
          }))
        };
      }

      if (symbol) {
        // console.log('OBJECT -------------> ', symbol.getName());
        return {
          kind: 'object',
          name: symbol.getName(),
          ref: type.getText()
        };
      }
    }

    // console.log('PRIMITIVE -------------> ', type.getText());
    return { kind: 'primitive', text: type.getText() };
  }
}
