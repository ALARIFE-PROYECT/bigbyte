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