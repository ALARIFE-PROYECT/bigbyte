import path from 'node:path';
import { Project, SourceFile, ClassDeclaration, InterfaceDeclaration, Type } from 'ts-morph';
import { v4 } from 'uuid';

import { ROOT_PATH } from '@bigbyte/utils/constant';

import { DuplicateClassError } from '../../exception';
import { ClasspathElement, ClasspathElementType } from '../../model/ClasspathElement';
import { ClasspathProperty } from '../../model/ClasspathProperty';
import { ClasspathMethod } from '../../model/ClasspathMethod';
import { ClasspathType } from '../../model/ClasspathType';
// import { ClasspathReference } from '../model/ClasspathReference';

interface Paths {
  rootPath: string;
  outPath: string;
}

export class ClasspathScanner {
  private buildOutDir: string;

  private buildRootDir: string;

  private project: Project;

  private classControlName: Set<string>;

  /**
   * Result
   */
  classpathElements: ClasspathElement[];

  constructor(tsPath: string, buildOutDir: string, buildRootDir: string) {
    this.buildOutDir = buildOutDir;
    this.buildRootDir = buildRootDir;

    this.project = new Project({ tsConfigFilePath: tsPath });

    this.classControlName = new Set<string>();
    this.classpathElements = [];
  }

  private cleanTypeText(typeText: string): string {
    return typeText.replace(/import\(["'][^)]+["']\)\./g, '');
  }

  // private getTypeReference(currentType: ClasspathType): ClasspathType {
  // const searchRef = (type: string | ClasspathReference): ClasspathType => {
  //   if (typeof type === 'string' && type.startsWith('import(')) {
  //     const name = this.cleanTypeText(type);
  //     const element = this.classpathElements.find((e) => e.name === name);
  //     if (!element) {
  //       throw new Error(`Reference type not found in classpath: ${name}`);
  //     }
  //     return {
  //       ref: element.id,
  //       name
  //     };
  //   }
  //   return type;
  // };
  // if (Array.isArray(currentType)) {
  //   return currentType.map(searchRef) as Array<string | ClasspathReference>;
  // } else {
  //   return searchRef(currentType);
  // }
  // }

  // private getUtilType() {}

  private getType(type: Type): ClasspathType {
    if (type.isUnion()) {
      return { kind: 'union', types: type.getUnionTypes().map((t) => this.getType(t)) };
    }

    if (type.isIntersection()) {
      return { kind: 'intersection', types: type.getIntersectionTypes().map((t) => this.getType(t)) };
    }

    if (type.isArray()) {
      const elementType = type.getArrayElementTypeOrThrow();
      return { kind: 'array', elementType: this.getType(elementType) };
    }

    // ! esta confundiendo object con alias

    const aliasSymbol = type.getAliasSymbol();
    const symbolName = aliasSymbol?.getName() || type.getSymbol()?.getName();
    if (aliasSymbol) {
      return {
        kind: 'alias',
        name: symbolName,
        arguments: type.getAliasTypeArguments().map((t) => this.getType(t))
      };
    }

    if (type.isObject()) {
      const symbol = type.getSymbol();
      const name = symbol?.getEscapedName() ?? "AnonymousObject";

      return {
        kind: 'object',
        name,
        properties: type.getProperties().map((p) => ({
          name: p.getName(),
          type: p.getValueDeclaration()
            ? this.getType(p.getTypeAtLocation(p.getValueDeclaration()!))
            : { kind: 'unknown' }
        }))
      };
    }

    return { kind: 'primitive', text: type.getText() };
  }

  private getProperties(element: ClassDeclaration | InterfaceDeclaration) {
    return element.getProperties().map((prop) => {
      let decorators: string[] = [];
      if ('getDecorators' in prop) {
        decorators = prop.getDecorators().map((d) => `@${d.getName()}`);
      }

      const type = this.getType(prop.getType());
      console.log('🚀 ~ ClasspathScanner ~ getProperties ~ type:', JSON.stringify(type));

      return {
        name: prop.getName(),
        type,
        decorators
      };
    });
  }

  private getMethods(element: ClassDeclaration | InterfaceDeclaration): ClasspathMethod[] {
    return element.getMethods().map((method) => {
      let decorators: string[] = [];
      if ('getDecorators' in method) {
        decorators = method.getDecorators().map((d) => `@${d.getName()}`);
      }

      const params: ClasspathProperty[] = method.getParameters().map((param) => {
        const paramDecorators = param.getDecorators().map((d) => `@${d.getName()}`);
        const type = this.getType(param.getType());
        console.log('🚀 ~ ClasspathScanner ~ getMethods ~ type:', JSON.stringify(type));

        return {
          name: param.getName(),
          type: type,
          decorators: paramDecorators
        };
      });

      const returnType = this.getType(method.getReturnType());
      console.log('🚀 ~ ClasspathScanner ~ getMethods ~ returnType:', JSON.stringify(returnType));

      return {
        name: method.getName(),
        decorators,
        params,
        returnType: returnType
      };
    });
  }

  private getPath(file: SourceFile): Paths {
    const rootPath = path.resolve(file.getFilePath());
    const classRelativePath = rootPath.replace(path.join(ROOT_PATH, this.buildRootDir), '');
    const outPath = path.join(ROOT_PATH, this.buildOutDir, classRelativePath.replace('.ts', '.js'));

    return { rootPath, outPath };
  }

  private checkName(name: string): void {
    if (this.classControlName.has(name) && name !== '<anonymous>') {
      throw new DuplicateClassError(`Duplicate class or interface names are not allowed. Name detected: ${name}`);
    }
    this.classControlName.add(name);
  }

  private scanClassDeclaration(file: SourceFile) {
    for (const cls of file.getClasses()) {
      const name = cls.getName() || '<anonymous>';
      this.checkName(name);

      const path = this.getPath(file);

      const decorators = cls.getDecorators().map((d) => `@${d.getName()}`);

      const props: ClasspathProperty[] = this.getProperties(cls);
      const methods: ClasspathMethod[] = this.getMethods(cls);

      this.classpathElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.CLASS,
        rootPath: path.rootPath,
        outPath: path.outPath,
        decorators,
        props,
        methods
      });
    }
  }

  private scanInterfaceDeclaration(file: SourceFile) {
    for (const iface of file.getInterfaces()) {
      const name = iface.getName();
      this.checkName(name);

      const path = this.getPath(file);
      const props: ClasspathProperty[] = this.getProperties(iface);
      const methods: ClasspathMethod[] = this.getMethods(iface);

      this.classpathElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.INTERFACE,
        rootPath: path.rootPath,
        outPath: path.outPath,
        props,
        methods
      });
    }
  }

  private scanEnumDeclaration(file: SourceFile) {
    for (const enumDecl of file.getEnums()) {
      const name = enumDecl.getName();
      const path = this.getPath(file);

      const values: Map<string, any> = new Map();
      const members = enumDecl.getMembers();

      for (const member of members) {
        const name = member.getName();
        const value = member.getValue();

        values.set(name, value);
      }

      this.classpathElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.ENUM,
        rootPath: path.rootPath,
        outPath: path.outPath,
        values
      });
    }
  }

  private startReferencing() {
    // this.classpathElements.forEach((element) => {
    //   element.props?.forEach((prop) => {
    //     prop.type = this.getTypeReference(prop.type);
    //   });
    //   element.methods?.forEach((method) => {
    //     method.params.forEach((param) => {
    //       param.type = this.getTypeReference(param.type);
    //     });
    //     method.returnType = this.getTypeReference(method.returnType);
    //   });
    // });
  }

  public scan(): ClasspathElement[] {
    const files = this.project.getSourceFiles(`${this.buildRootDir}/**/*.ts`);

    for (const file of files) {
      this.scanEnumDeclaration(file);
      this.scanClassDeclaration(file);
      this.scanInterfaceDeclaration(file);
    }

    this.startReferencing();

    return this.classpathElements;
  }
}
