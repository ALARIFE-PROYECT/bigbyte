import { Project, SourceFile } from 'ts-morph';

import { ClasspathUtils } from './ClasspathUtils';
import { ClasspathClassScanner } from './element/ClasspathClassScanner';
import { ClasspathInterfaceScanner } from './element/ClasspathInterfaceScanner';
import { ClasspathElement, ClasspathEnumElement } from '../../model/ClasspathElement';
import { ClasspathEnumScanner } from './element/ClasspathEnumScanner';
export class ClasspathScanner {
  private files: SourceFile[];

  private classpathElements: ClasspathElement[];

  private classpathEnums: ClasspathEnumElement[];

  /**
   * Scanners
   */
  private classpathClassScanner: ClasspathClassScanner;

  private classpathInterfaceScanner: ClasspathInterfaceScanner;

  private classpathEnumsScanner: ClasspathEnumScanner;

  constructor(tsPath: string, buildOutDir: string, buildRootDir: string) {
    const project = new Project({ tsConfigFilePath: tsPath });
    this.files = project.getSourceFiles(`${buildRootDir}/**/*.ts`);

    const utils = new ClasspathUtils(buildOutDir, buildRootDir);

    this.classpathClassScanner = new ClasspathClassScanner(utils);
    this.classpathInterfaceScanner = new ClasspathInterfaceScanner(utils);
    this.classpathEnumsScanner = new ClasspathEnumScanner(utils);

    this.classpathElements = [];
    this.classpathEnums = [];
  }

  private referencingElements(elements: ClasspathElement[]): ClasspathElement[] {
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

    return elements;
  }

  public scan(): ClasspathElement[] {
    for (const file of this.files) {
      const classElements = this.classpathClassScanner.scan(file);
      this.classpathElements.push(...classElements);

      const interfaceElements = this.classpathInterfaceScanner.scan(file);
      this.classpathElements.push(...interfaceElements);

      this.classpathEnums = this.classpathEnumsScanner.scan(file);
    }

    console.log('RESULT');
    console.log(JSON.stringify(this.classpathElements, null, 2));
    // console.log(JSON.stringify(this.classpathEnums, null, 2));

    return this.referencingElements(this.classpathElements);
  }
}
