import { Project, SourceFile } from 'ts-morph';
import Logger from '@bigbyte/utils/logger';

import { ClasspathUtils } from './ClasspathUtils';
import { ClasspathElement } from '../../model/ClasspathElement';
import { ClassScanner } from './element/ClassScanner';
import { InterfaceScanner } from './element/InterfaceScanner';
import { EnumScanner } from './element/EnumScanner';
import { ReferenceStep } from './step/ReferenceStep';
import { LIBRARY_NAME } from '../../constant';

const log = new Logger(LIBRARY_NAME);

export class ClasspathScanner {
  private files: SourceFile[];

  private classpathElements: ClasspathElement[];

  /**
   * Scanners
   */
  private classScanner: ClassScanner;

  private interfaceScanner: InterfaceScanner;

  private enumScanner: EnumScanner;

  /**
   * Step
   */
  private referenceStep: ReferenceStep;

  constructor(tsPath: string, buildOutDir: string, buildRootDir: string) {
    const project = new Project({ tsConfigFilePath: tsPath });
    this.files = project.getSourceFiles(`${buildRootDir}/**/*.ts`);

    const utils = new ClasspathUtils(buildOutDir, buildRootDir);

    this.classScanner = new ClassScanner(utils);
    this.interfaceScanner = new InterfaceScanner(utils);
    this.enumScanner = new EnumScanner(utils);

    this.referenceStep = new ReferenceStep();

    this.classpathElements = [];
  }

  public scan(): ClasspathElement[] {
    for (const file of this.files) {
      const classElements = this.classScanner.scan(file);
      this.classpathElements.push(...classElements);

      const interfaceElements = this.interfaceScanner.scan(file);
      this.classpathElements.push(...interfaceElements);

      const enumElements = this.enumScanner.scan(file);
      this.classpathElements.push(...enumElements);
    }

    const result = this.referenceStep.resolveReferences(this.classpathElements);

    console.log('RESULT-----------------------------------------------------------');
    console.log(JSON.stringify(result, null, 2));

    return result;
  }
}
