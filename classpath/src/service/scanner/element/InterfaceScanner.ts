import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';
import Logger from '@bigbyte/utils/logger';

import { ClasspathElementType, ClasspathElement } from '../../../model/ClasspathElement';
import { ClasspathUtils } from '../ClasspathUtils';
import { ClasspathProperty } from '../../../model/ClasspathProperty';
import { ClasspathMethod } from '../../../model/ClasspathMethod';
import { MethodScanner } from '../part/MethodScanner';
import { PropertyScanner } from '../part/PropertyScanner';
import { LIBRARY_NAME } from '../../../constant';


const log = new Logger(LIBRARY_NAME);

export class InterfaceScanner {
  private classpathUtils: ClasspathUtils;

  private propertyScanner: PropertyScanner;

  private methodScanner: MethodScanner;

  constructor(classpathUtils: ClasspathUtils) {
    this.classpathUtils = classpathUtils;

    this.propertyScanner = new PropertyScanner();
    this.methodScanner = new MethodScanner();
  }

  public scan(file: SourceFile): ClasspathElement[] {
    const interfaceElements: Array<ClasspathElement> = [];

    for (const iface of file.getInterfaces()) {
      const name = iface.getName();
      this.classpathUtils.checkName(name);

      // log.dev('----------> INTERFACE Name:', name);

      const path = this.classpathUtils.getPath(file);
      const properties: ClasspathProperty[] = this.propertyScanner.scanProperties(iface);
      const methods: ClasspathMethod[] = this.methodScanner.scanMethods(iface);

      interfaceElements.push({
        id: v4(),
        name,
        type: ClasspathElementType.INTERFACE,
        rootPath: path.rootPath,
        outPath: path.outPath,
        properties,
        methods
      });
    }

    return interfaceElements;
  }
}
