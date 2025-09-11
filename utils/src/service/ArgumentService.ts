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
 * Busca los argumentos pasados al proceso de ejecución.
 * * Heredados previamente por el cli.js
 */

export interface ArgumentsService {
    get(key: string): string | undefined;
    getValue(key: string): string | undefined;
    has(key: string): boolean;
}

export const argumentsService: ArgumentsService = {
    get(key: string): string | undefined {
        return process.argv.find((arg) => arg.includes(key));
    },
    getValue(key: string): string | undefined {
        const arg = this.get(key);

        if (arg) {
            const [_, value] = arg.split('=');

            return value;
        }
        return undefined;
    },
    has(key: string): boolean {
        return Boolean(process.argv.includes(key));
    }
};
