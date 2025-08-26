import { SourceFile } from 'ts-morph';
import { v4 } from 'uuid';
import Logger from '@bigbyte/utils/logger';

import { ClasspathElement, ClasspathElementType, ClasspathEnumType } from '../../../model/ClasspathElement';
import { ClasspathUtils } from '../ClasspathUtils';
import { LIBRARY_NAME } from '../../../constant';



const log = new Logger(LIBRARY_NAME);

export class EnumScanner {
  private classpathUtils: ClasspathUtils;


  constructor(classpathUtils: ClasspathUtils) {
    this.classpathUtils = classpathUtils;
  }

  public scan(file: SourceFile): ClasspathElement[] {
    const enumElements: Array<ClasspathElement> = [];

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

      enumElements.push({
        id: v4(),
        name,
        rootPath: path.rootPath,
        outPath: path.outPath,
        type: ClasspathElementType.ENUM,
        values
      });
    }

    return enumElements;
  }
}
