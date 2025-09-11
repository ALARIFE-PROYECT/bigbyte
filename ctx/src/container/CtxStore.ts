/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/ctx.
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

import { environmentService } from "@bigbyte/utils/environment";
import Logger from "@bigbyte/utils/logger";

import { StoreValue } from "../model/StoreValue";
import { LIBRARY_NAME } from "../constant";


const log = new Logger(LIBRARY_NAME);

/**
 * CtxStore es un contenedor de inyeccion de valores que se utiliza para almacenar los valores.
 * 
 * * Los valores no son editables
 */
class CtxStore {

    registry: Array<StoreValue>;

    constructor() {
        this.registry = [];
    }

    add(key: string, value: string | undefined): void {
        if (environmentService.has(key)) {
            log.warn(`The value with key "${key}" already exists in the ValueStore.`);
        } else {
            const instanceValue = new StoreValue(key, value);
            this.registry.push(instanceValue);
        }
    }

    getByKey(key: string): StoreValue | undefined {
        const storeValue = this.registry.find(v => v.key === key);

        if (storeValue) {
            return storeValue;
        } else {
            const value = environmentService.get(key);
            return { key, value } as StoreValue;
        }
    }

    getById(id: string): StoreValue | undefined {
        return this.registry.find(v => v.id === id);
    }

    getAllStoreValues(): StoreValue[] {
        const environments: StoreValue[] = [];

        environmentService.keys().forEach((key: string) => {
            const value = environmentService.get(key);
            environments.push({ key, value } as StoreValue);
        });

        return [...this.registry, ...environments]
    }

    getAllValues(): Map<string, string | undefined> {
        const map = new Map<string, string | undefined>();

        environmentService.keys().forEach((key: string) => {
            const value = environmentService.get(key);
            map.set(key, value);
        });

        this.registry.forEach((sv: StoreValue) => {
            map.set(sv.key, sv.value ? String(sv.value) : undefined);
        });

        return map;
    }

    hasKey(key: string): boolean {
        let index = this.registry.findIndex(v => v.key === key);
        return index !== -1;
    }

    hasValue(value: any): boolean {
        let index = this.registry.findIndex(v => v.value === value);
        return index !== -1;
    };
}

export const ctxStore = new CtxStore();

