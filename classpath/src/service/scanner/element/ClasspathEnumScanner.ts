import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';

import { ClasspathEnumElement, ClasspathEnumType } from '../../../model/ClasspathElement';
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
      const values: Array<ClasspathEnumType> = [];

      enumDecl.getMembers().forEach((member) => {
        const name = member.getName();
        let value: string;

        if (member.getInitializer()) {
          const initializer = member.getInitializer()!;
          const literalValue = initializer.getText();

          if (/^\d+$/.test(literalValue)) {
            value = literalValue;
          } else if (
            (literalValue.startsWith('"') && literalValue.endsWith('"')) ||
            (literalValue.startsWith("'") && literalValue.endsWith("'"))
          ) {
            value = literalValue.slice(1, -1);
          } else {
            value = literalValue;
          }
        } else {
          value = enumDecl.getMembers().indexOf(member).toString();
        }

        values.push({ name, value });
      });

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
