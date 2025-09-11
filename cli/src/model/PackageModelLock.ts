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