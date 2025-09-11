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

import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { FormatError, MissingFileError } from "../exception";

export const readJsonFile = <T>(filePath: string, fileName: string): T => {
    let packagePath: string = path.join(filePath, fileName);

    if (!existsSync(packagePath)) {
        throw new MissingFileError(fileName, packagePath);
    }

    const fileContent = readFileSync(packagePath, 'utf-8')

    let content;
    try {
        content = JSON.parse(fileContent);
    } catch (error) {
        throw new FormatError(packagePath);
    }

    return content
}
