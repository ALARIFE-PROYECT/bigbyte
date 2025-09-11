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
