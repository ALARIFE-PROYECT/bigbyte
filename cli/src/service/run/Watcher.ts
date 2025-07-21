import path from "path";
import chokidar, { FSWatcher } from 'chokidar';
import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { LIBRARY_NAME } from "../../constant";
import { compileTypeScript } from "./TypeScriptCompiler";
import { relaunchRun } from "./RunLauncher";


const log = new Logger('Watcher', LIBRARY_NAME);
let watcherProcess: FSWatcher;

/**
 * TODO: Implementar un hot-reload de los cambios en el código.
 * TODO: Tiene una alta complejidad, se tendran que abir canales de comunicación con el core
 * 
 * Handles file changes detected by the watcher.
 * 
 * @param filePath - The path of the file that has changed
 */
const changeAction = async (filePath: string) => {
  const relativePath = path.relative(ROOT_PATH, filePath);
  log.debug(`[${new Date().toLocaleTimeString()}] Modification: ${relativePath}`);

  try {
    await compileTypeScript(filePath);
  } catch (error: any) {
    log.error('Modification error: ', error);
  }

  relaunchRun();
}

export const initChangeDetector = (buildRootDir: string) => {
  if (!watcherProcess) {
    const watchPaths: string[] = [
      path.join(ROOT_PATH, buildRootDir, '**', '*.{ts,js}'),
      // path.join(ROOT_PATH, 'package.json')
    ];

    watcherProcess = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    watcherProcess.on('change', changeAction);
    watcherProcess.on('add', changeAction);
    watcherProcess.on('unlink', changeAction);
    watcherProcess.on('error', error => {
      log.error(`Monitoring error: ${error}`);
    });
  }
}
