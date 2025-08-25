import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';

import { ClasspathElement, ClasspathElementType } from '../../../model/ClasspathElement';
import { ClasspathProperty } from '../../../model/ClasspathProperty';
import { ClasspathMethod } from '../../../model/ClasspathMethod';
import { ClasspathUtils } from '../ClasspathUtils';
import { ClasspathScannerProperties } from '../part/ClasspathScannerProperties';
import { ClasspathScannerMethods } from '../part/ClasspathScannerMethods';


export class ClasspathClassScanner {

  private classpathUtils: ClasspathUtils;

  private classpathElements: Array<ClasspathElement>;

  private classpathScannerProperties: ClasspathScannerProperties;

  private classpathScannerMethods: ClasspathScannerMethods;

  constructor(classpathUtils: ClasspathUtils) {
    this.classpathElements = [];
    this.classpathUtils = classpathUtils;

    this.classpathScannerProperties = new ClasspathScannerProperties();
    this.classpathScannerMethods = new ClasspathScannerMethods();
  }

  public scan(file: SourceFile): ClasspathElement[] {
    for (const cls of file.getClasses()) {
      const name = cls.getName() || '<anonymous>';
      this.classpathUtils.checkName(name);

      console.log('|||||||||||||||||||||||| CLASS Name:', name);

      const path = this.classpathUtils.getPath(file);

      const decorators = cls.getDecorators().map((d) => `@${d.getName()}`);

      const properties: ClasspathProperty[] = this.classpathScannerProperties.scanProperties(cls);
      const methods: ClasspathMethod[] = this.classpathScannerMethods.scanMethods(cls);

      this.classpathElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.CLASS,
        rootPath: path.rootPath,
        outPath: path.outPath,
        decorators,
        properties,
        methods
      });
    }

    return this.classpathElements;
  }
}
