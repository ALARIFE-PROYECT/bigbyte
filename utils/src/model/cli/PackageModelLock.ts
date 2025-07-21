export interface PackageModelLockDependency {
    version: string,
    resolved: string,
    integrity: string,
    dev?: boolean,
    dependencies?: Record<string, string>,
    engines?: Record<string, string>,
    peerDependencies?: Record<string, string>,
    optionalDependencies?: Record<string, string>,
}

export interface PackageModelLock {
    name: string,
    version: string,
    lockfileVersion: number,
    requires: boolean,
    packages: {
        [key: string]: PackageModelLockDependency
    }
}