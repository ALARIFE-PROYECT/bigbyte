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
import { existsSync } from "node:fs";

import Logger from "@bigbyte/utils/logger";
import { ROOT_PATH, LIBRARY_ORGANIZATION_NAME } from "@bigbyte/utils/constant";
import { Addon, Dependency, Configuration } from "@bigbyte/integration";

import { INTEGRATION_CONFIGURATION_PATH, LIBRARY_NAME } from "../../constant";


const log = new Logger(LIBRARY_NAME);

export const readAddons = (dependencies: Dependency[]): Addon[] => {
    const addons: Addon[] = [];

    dependencies.forEach((dependency: Dependency) => {
        const addon: Addon = {
            name: dependency.name,
            version: dependency.version,
            path: path.join(ROOT_PATH, "node_modules", LIBRARY_ORGANIZATION_NAME, dependency.name),
        };

        const integrationConfigPath = path.join(addon.path, INTEGRATION_CONFIGURATION_PATH);
        if (existsSync(integrationConfigPath)) {
            const configuration: Configuration = require(integrationConfigPath).default;
            if (configuration) {
                addon.configuration = configuration;
            }
        } else {
            log.dev(`File ${integrationConfigPath} does not exist in addon ${dependency.name}.`)
        }

        addons.push(addon);

    });

    return addons;
}
