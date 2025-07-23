/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de valores programaticamente.
 */

import { ComponentType, StoreValue } from "@bigbyte/utils/registry";
import { NativeType } from "@bigbyte/utils";

import coreComponentRegistry from "../container/CoreComponentRegistry";
import coreValueStore from "../container/coreValueStore";


export class ValueStore {
    getValue(key: string): NativeType {
        return coreValueStore.getByKey(key)?.value;
    }

    getStoreValue(key: string): StoreValue | undefined {
        return coreValueStore.getByKey(key);
    }

    getAllValues(): Map<string, NativeType> {
        return coreValueStore.getAllValues();
    }

    has(key: string): boolean {
        return coreValueStore.hasKey(key);
    }

    add(key: string, value: NativeType): void {
        coreValueStore.add(key, value);
    }
}

coreComponentRegistry.add(ValueStore, [], { type: ComponentType.COMPONENT, injectable: true });
