import { SyntaxKind, Type, TypeAliasDeclaration, TypeNode } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { ClasspathType } from '../../../model/ClasspathType';
import { LIBRARY_NAME } from '../../../constant';


const log = new Logger(LIBRARY_NAME);

export class TypeScanner {
  constructor() {}

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
        // log.dev('ENUM NODE -> ', symbol?.getName());

        return { kind: 'enum', name: symbol?.getName(), ref: type.getText() };
      } else if (typeArgs.length > 0) {
        // log.dev('ALIAS NODE -> ', type.getText());

        return {
          kind: 'alias',
          name: typeName,
          arguments: typeArgs.map((t) => this.getType(t.getType(), t))
        };
      } else {
        // log.dev('OBJECT NODE -> ', type.getText());

        return {
          kind: 'object',
          name: typeName,
          ref: type.getText()
        };
      }
    } else if (type.isEnum() || type.isEnumLiteral()) {
      // log.dev('ENUM -> ', symbol?.getName());
      return { kind: 'enum', name: symbol?.getName(), ref: type.getText() };
    }

    /** UNION */
    if (typeNode && typeNode.getKind() === SyntaxKind.UnionType) {
      // log.dev('UNION NODE -> ', typeNode.getText());
      const unionNode = typeNode.asKindOrThrow(SyntaxKind.UnionType);
      return {
        kind: 'union',
        types: unionNode.getTypeNodes().map((n) => this.getType(n.getType(), n))
      };
    } else if (type.isUnion()) {
      // log.dev('UNION -> ', type.getText());
      return { kind: 'union', types: type.getUnionTypes().map((t) => this.getType(t)) };
    }

    /** INTERSECTION */
    if (typeNode && typeNode.getKind() === SyntaxKind.IntersectionType) {
      // log.dev('INTERSECTION NODE -> ', type.getText());
      const intersectionNode = typeNode.asKindOrThrow(SyntaxKind.IntersectionType);
      return {
        kind: 'intersection',
        types: intersectionNode.getTypeNodes().map((n) => this.getType(n.getType(), n))
      };
    } else if (type.isIntersection()) {
      // log.dev('INTERSECTION -> ', type.getText());
      return { kind: 'intersection', types: type.getIntersectionTypes().map((t) => this.getType(t)) };
    }

    /** Array */
    if (typeNode && typeNode.getKind() === SyntaxKind.ArrayType) {
      const arrayNode = typeNode.asKindOrThrow(SyntaxKind.ArrayType);
      const elementType = arrayNode.getElementTypeNode();

      return { kind: 'array', elementType: this.getType(elementType.getType(), elementType) };
    } else if (type.isArray()) {
      const elementType = type.getArrayElementTypeOrThrow();
      return { kind: 'array', elementType: this.getType(elementType) };
    }

    if (aliasSymbol) {
      // log.dev('ALIAS -> ', type.getText());
      return {
        kind: 'alias',
        name: aliasSymbol.getName(),
        arguments: type.getAliasTypeArguments().map((t) => this.getType(t))
      };
    }

    if (type.isObject()) {
      const name = symbol?.getName();
      if (!symbol || name === '__type' || name === '__object') {
        // log.dev('INLINE OBJECT -> ', type.getText());

        return {
          kind: 'inline-object',
          properties: type.getProperties().map((p) => ({
            name: p.getName(),
            type: this.getType(p.getTypeAtLocation(p.getValueDeclaration()!))
          }))
        };
      }

      if (symbol) {
        const name = symbol.getName();
        // log.dev('OBJECT -> ', name);

        /**
         * Existe el caso de que no exportes una interfaz o clase o enum o funcion, pero aun asi se tiene que referenciar.
         * Entonces se añade manualmente la palabra import(), asi despues el erferenciador puede identificarlo.
         */
        let ref = type.getText();
        if(!ref.includes('import(')) {
          ref = `import("${symbol.getDeclarations()[0].getSourceFile().getFilePath()}").${ref}`;
        }

        const object: ClasspathType = {
          kind: 'object',
          name,
          ref
        };

        const typeArgs = type.getTypeArguments();
        if (typeArgs.length > 0) {
          object.generic = typeArgs.map((t) => this.getType(t));
        }

        return object;
      }
    }

    // log.dev('PRIMITIVE -> ', type.getText());
    return { kind: 'primitive', text: type.getText() };
  }
}
