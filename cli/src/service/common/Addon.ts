import path from "node:path";
import { existsSync } from "node:fs";

import Logger from "@bigbyte/utils/logger";
import { ROOT_PATH, LIBRARY_ORGANIZATION_NAME } from "@bigbyte/utils/constant";

import { INTEGRATION_CONFIGURATION_PATH, LIBRARY_NAME } from "../../constant";
import { Addon, Configuration, Dependency } from "@bigbyte/utils/integration";


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
