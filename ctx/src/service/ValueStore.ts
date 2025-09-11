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

/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de valores programaticamente.
 */

import { ComponentType, componentRegistry } from "@bigbyte/ioc";

import { ctxStore } from "../container/CtxStore";
import { StoreValue } from "../model/StoreValue";


export class ValueStore {
    getValue(key: string): string | undefined {
        const value = ctxStore.getByKey(key)?.value;
        return value ? String(value) : undefined;
    }

    getStoreValue(key: string): StoreValue | undefined {
        return ctxStore.getByKey(key);
    }

    getAllValues(): Map<string, string | undefined> {
        return ctxStore.getAllValues();
    }

    has(key: string): boolean {
        return ctxStore.hasKey(key);
    }

    add(key: string, value: string | undefined): void {
        ctxStore.add(key, value);
    }
}

componentRegistry.add(ValueStore, [], { type: ComponentType.COMPONENT, injectable: true });