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

import { LIBRARY_ORGANIZATION_NAME, ROOT_PATH } from "@bigbyte/utils/constant";
import { Dependency } from "@bigbyte/integration";

import { PackageModel } from "../../model/PackageModel";
import { PackageModelLock, PackageModelLockDependency } from "../../model/PackageModelLock";
import { MissingConfigurationError } from "../../exception";

import { readJsonFile } from "../../util/File";


let packageJson: PackageModel | undefined;
let packageJsonLock: PackageModelLock | undefined;

const getInstalledVersion = (packageName: string): PackageModelLockDependency | undefined => {
    if (!packageJsonLock?.packages) {
        throw new MissingConfigurationError('package-lock.json', 'packages')
    }

    const dependencyName: string | undefined = Object.keys(packageJsonLock.packages).find((dependency: string) => dependency.includes(packageName));

    if (!dependencyName) {
        return undefined;
    }

    const dependency: PackageModelLockDependency = packageJsonLock.packages[dependencyName];

    return dependency;
}

const readTargetPackageJson = (): void => {
    packageJson = readJsonFile<PackageModel>(ROOT_PATH, 'package.json');
    packageJsonLock = readJsonFile<PackageModelLock>(ROOT_PATH, 'package-lock.json');
}

export const getDependencies = (): Dependency[] => {
    readTargetPackageJson();

    if (!packageJson?.dependencies) {
        throw new MissingConfigurationError('package.json', 'dependencies')
    }

    const dependencies: Dependency[] = [];
    Object.keys(packageJson.dependencies).forEach((dependency: string) => {
        if (dependency.startsWith(LIBRARY_ORGANIZATION_NAME)) {
            const name = dependency.replace(`${LIBRARY_ORGANIZATION_NAME}/`, '');
            const installedDependency = getInstalledVersion(dependency);

            dependencies.push({
                name: name,
                version: installedDependency?.version ?? '0.0.0',
            });
        }
    });

    packageJson = undefined;
    packageJsonLock = undefined;

    return dependencies;
}
