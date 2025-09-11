/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/utils.
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


/**
 * Busca la environment variable en el entorno de ejecución.
 * * Almacenadas previamente en el process por el cli.js
 * 
 * * Trabaja en paralelo con el registry de coreValueStore
 */
export interface EnvironmentService {
    get(key: string): string | undefined;
    has(key: string): boolean;
    keys(): Array<string>;
    values(): Array<string | undefined>;
}

export const environmentService: EnvironmentService =  {
    get(key: string): string | undefined {
        return process.env[key];
    },
    has(key: string): boolean {
        return Boolean(process.env[key]);
    },
    keys(): Array<string> {
        return Object.keys(process.env);
    },
    values(): Array<string | undefined> {
        return Object.values(process.env);
    }
};
