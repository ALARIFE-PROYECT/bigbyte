import Logger from '@bigbyte/utils/logger';
import { ClasspathScanner } from '@bigbyte/classpath/scanner';
import { CommandData } from '@bigbyte/integration';

import { TsConfigData } from '../model/TsConfigData';
import { LIBRARY_NAME } from '../constant';
import { readTsConfig } from '../service/run/TypeScriptCompiler';


const log = new Logger(LIBRARY_NAME);

export default async (commandData: CommandData) => {
  const initPerformance = performance.now();

  const tsConfigData: TsConfigData = readTsConfig();
  const { tsPath, buildOutDir, buildRootDir } = tsConfigData;
  const scannerService = new ClasspathScanner(tsPath, buildOutDir, buildRootDir);

  const classpath = scannerService.scan();

  const endPerformance = performance.now();
  log.info(
    `Classpath scanned in ${Math.round(endPerformance - initPerformance)} ms. Found ${classpath.length} classes.`
  );
};
