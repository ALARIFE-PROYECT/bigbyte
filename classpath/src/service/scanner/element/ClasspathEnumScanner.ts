import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';

import { ClasspathEnumElement } from '../../../model/ClasspathElement';
import { ClasspathUtils } from '../ClasspathUtils';

export class ClasspathEnumScanner {
  private classpathUtils: ClasspathUtils;

  private classpathEnumElements: Array<ClasspathEnumElement>;

  constructor(classpathUtils: ClasspathUtils) {
    this.classpathUtils = classpathUtils;

    this.classpathEnumElements = [];
  }

  public scan(file: SourceFile): ClasspathEnumElement[] {
    for (const enumDecl of file.getEnums()) {
      const name = enumDecl.getName();
      const path = this.classpathUtils.getPath(file);
      const values: Map<string, any> = new Map();
      const members = enumDecl.getMembers();
      
      for (const member of members) {
        const name = member.getName();
        const value = member.getValue();
        values.set(name, value);
      }

      this.classpathEnumElements.push({
        id: v4(),
        name,
        rootPath: path.rootPath,
        outPath: path.outPath,
        values
      });
    }

    return this.classpathEnumElements;
  }
}
