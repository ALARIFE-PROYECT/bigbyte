/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de valores programaticamente.
 */

import { ComponentType, StoreValue } from "@bigbyte/utils/registry";

import coreComponentRegistry from "../container/CoreComponentRegistry";
import coreValueStore from "../container/coreValueStore";


export class ValueStore {
    getValue(key: string): string | undefined {
        const value = coreValueStore.getByKey(key)?.value;
        return value ? String(value) : undefined;
    }

    getStoreValue(key: string): StoreValue | undefined {
        return coreValueStore.getByKey(key);
    }

    getAllValues(): Map<string, string | undefined> {
        return coreValueStore.getAllValues();
    }

    has(key: string): boolean {
        return coreValueStore.hasKey(key);
    }

    add(key: string, value: string | undefined): void {
        coreValueStore.add(key, value);
    }
}

coreComponentRegistry.add(ValueStore, [], { type: ComponentType.COMPONENT, injectable: true });
