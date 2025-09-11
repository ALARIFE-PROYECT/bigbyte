/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

import path from "path";
import chokidar, { FSWatcher } from 'chokidar';
import { ROOT_PATH } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";

import { LIBRARY_NAME } from "../../constant";
import { compileTypeScript } from "./TypeScriptCompiler";
import { relaunchRun } from "./RunLauncher";


const log = new Logger(LIBRARY_NAME);
let watcherProcess: FSWatcher;

/**
 * TODO: Implementar un hot-reload de los cambios en el código.
 * 
 * Handles file changes detected by the watcher.
 * 
 * @param filePath - The path of the file that has changed
 */
const handlerChange = async (filePath: string) => {
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
    const watchPaths: string[] = [path.join(ROOT_PATH, buildRootDir, '**', '*.{ts,js}')];

    watcherProcess = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    watcherProcess.on('change', handlerChange);
    watcherProcess.on('add', handlerChange);
    watcherProcess.on('unlink', handlerChange);
    watcherProcess.on('error', error => {
      log.error(`Monitoring error: ${error}`);
    });
  }
}
