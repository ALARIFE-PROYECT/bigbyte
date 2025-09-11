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

import Logger from '@bigbyte/utils/logger';
import { ClasspathScanner } from '@bigbyte/classpath/scanner';
import { CommandData } from '@bigbyte/integration';

import { TsConfigData } from '../model/TsConfigData';
import { LIBRARY_NAME } from '../constant';
import { readTsConfig } from '../service/run/TypeScriptCompiler';

const log = new Logger(LIBRARY_NAME);

const logMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log({
    rss: (used.rss / 1024 / 1024).toFixed(2) + ' MB', // Memoria total asignada
    heapTotal: (used.heapTotal / 1024 / 1024).toFixed(2) + ' MB', // Heap asignado
    heapUsed: (used.heapUsed / 1024 / 1024).toFixed(2) + ' MB', // Heap en uso real
    external: (used.external / 1024 / 1024).toFixed(2) + ' MB' // Buffers, etc.
  });
};

export default async (commandData: CommandData) => {
  const initPerformance = performance.now();
  const start = process.cpuUsage();

  const tsConfigData: TsConfigData = readTsConfig();
  const { tsPath, buildOutDir, buildRootDir } = tsConfigData;
  const scannerService = new ClasspathScanner(tsPath, buildOutDir, buildRootDir);

  const classpath = scannerService.scan();

  console.log('RESULT-----------------------------------------------------------');
  console.log(JSON.stringify(classpath, null, 2));

  logMemoryUsage();

  const end = process.cpuUsage(start);
  console.log(`User CPU time: ${end.user / 1000} ms`);
  console.log(`System CPU time: ${end.system / 1000} ms`);

  const endPerformance = performance.now();
  log.info(
    `Classpath scanned in ${Math.round(endPerformance - initPerformance)} ms. Found ${classpath.length} classes.`
  );
};
