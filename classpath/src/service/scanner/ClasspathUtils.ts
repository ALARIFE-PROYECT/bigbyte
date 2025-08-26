import path from 'node:path';
import { SourceFile } from 'ts-morph';
import { ROOT_PATH } from '@bigbyte/utils/constant';

import { DuplicateClassError } from '../../exception';

export interface Paths {
  rootPath: string;
  outPath: string;
}

export class ClasspathUtils {
  private buildOutDir: string;

  private buildRootDir: string;

  private classControlName: Set<string>;

  constructor(buildOutDir: string, buildRootDir: string) {
    this.buildOutDir = buildOutDir;
    this.buildRootDir = buildRootDir;

    this.classControlName = new Set<string>();
  }

  public getPath(file: SourceFile): Paths {
    const rootPath = path.resolve(file.getFilePath());
    const classRelativePath = rootPath.replace(path.join(ROOT_PATH, this.buildRootDir), '');
    const outPath = path.join(ROOT_PATH, this.buildOutDir, classRelativePath.replace('.ts', '.js'));

    return { rootPath, outPath };
  }

  public checkName(name: string): void {
    if(name.includes('anonymous')) {
      return;
    }

    if (this.classControlName.has(name)) {
      throw new DuplicateClassError(`Duplicate class or interface names are not allowed. Name detected: ${name}`);
    }
    this.classControlName.add(name);
  }
}
