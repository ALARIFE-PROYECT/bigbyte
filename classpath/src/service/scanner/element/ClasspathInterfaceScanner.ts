import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';

import { ClasspathElementType, ClasspathElement } from '../../../model/ClasspathElement';
import { ClasspathUtils } from '../ClasspathUtils';
import { ClasspathScannerMethods } from '../part/ClasspathScannerMethods';
import { ClasspathScannerProperties } from '../part/ClasspathScannerProperties';
import { ClasspathProperty } from '../../../model/ClasspathProperty';
import { ClasspathMethod } from '../../../model/ClasspathMethod';

export class ClasspathInterfaceScanner {
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
    for (const iface of file.getInterfaces()) {
      const name = iface.getName();
      this.classpathUtils.checkName(name);

      // console.log('|||||||||||||||||||||||| INTERFACE Name:', name);

      const path = this.classpathUtils.getPath(file);
      const properties: ClasspathProperty[] = this.classpathScannerProperties.scanProperties(iface);
      const methods: ClasspathMethod[] = this.classpathScannerMethods.scanMethods(iface);

      this.classpathElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.INTERFACE,
        rootPath: path.rootPath,
        outPath: path.outPath,
        properties,
        methods
      });
    }

    // console.log('RESULT : ', JSON.stringify(this.classpathElements, null, 2));
    return this.classpathElements;
  }
}
