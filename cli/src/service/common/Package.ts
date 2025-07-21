import { PackageModel, PackageModelLock, PackageModelLockDependency } from '@bigbyte/utils/cli';
import { LIBRARY_ORGANIZATION_NAME, ROOT_PATH } from "@bigbyte/utils/constant";
import { Dependency } from '@bigbyte/utils/integration';

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
