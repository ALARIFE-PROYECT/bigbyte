// import path from "node:path";
// import { ClassDeclaration, InterfaceDeclaration, Project, SyntaxKind, Type } from "ts-morph";
// import { v4 } from "uuid";

import Logger from '@bigbyte/utils/logger';
import { ClasspathElement } from '@bigbyte/classpath';
import { ClasspathScanner } from '@bigbyte/classpath/scanner';

import { TsConfigData } from '../../model/TsConfigData';
import { LIBRARY_NAME } from '../../constant';

const log = new Logger(LIBRARY_NAME);

export const scanClasspath = (tsConfigData: TsConfigData): ClasspathElement[] => {
  const initPerformance = performance.now();

  const { tsPath, buildOutDir, buildRootDir } = tsConfigData;
  const scannerService = new ClasspathScanner(tsPath, buildOutDir, buildRootDir);

  const classpath = scannerService.scan();

  const endPerformance = performance.now();
  log.dev(
    `Classpath scanned in ${Math.round(endPerformance - initPerformance)} ms. Found ${classpath.length} classes.`
  );

  return classpath;
};
