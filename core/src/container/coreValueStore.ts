import { NativeType, environmentService } from '@bigbyte/utils';
import Logger from '@bigbyte/utils/logger';

import { StoreValue, CoreValueStore } from '@bigbyte/utils/registry';
import { LIBRARY_NAME } from '../constant';


const log = new Logger('ValueStore', LIBRARY_NAME);

/**
 * CoreValueRegistry es un contenedor de inyeccion de valores que se utiliza para almacenar los valores del core y sus addons.
 * 
 * * Los valores no son editables
 */
export const coreValueStore: StoreValue[] = new Array<StoreValue>();

const add = (key: string, value: NativeType): void => {
    if (environmentService.has(key)) {
        log.warn(`The value with key "${key}" already exists in the ValueStore.`);
    } else {
        const instanceValue = new StoreValue(key, value);
        coreValueStore.push(instanceValue);
    }
};

const getByKey = (key: string): StoreValue | undefined => {
    console.log('env: ', process.env);
    
    console.log("🚀 ~ key:", key)
    const storeValue = coreValueStore.find(v => v.key === key);
    console.log("🚀 ~ storeValue:", storeValue)
    if (storeValue) {
        return storeValue;
    } else {
        const value = environmentService.get(key);
        console.log("🚀 ~ value:", value)
        return { key, value } as StoreValue;
    }
}

const getById = (id: string): StoreValue | undefined => {
    return coreValueStore.find(v => v.id === id);
}

const getAllStoreValues = (): StoreValue[] => {
    const environments: StoreValue[] = [];

    environmentService.keys().forEach((key: string) => {
        const value = environmentService.get(key);
        environments.push({ key, value } as StoreValue);
    });

    return [...coreValueStore, ...environments]
}

const getAllValues = (): Map<string, NativeType> => {
    const map = new Map<string, NativeType>();

    environmentService.keys().forEach((key: string) => {
        const value = environmentService.get(key);
        map.set(key, value);
    });

    coreValueStore.forEach((sv: StoreValue) => {
        map.set(sv.key, sv.value);
    });

    return map;
}

const hasKey = (key: string): boolean => {
    let index = coreValueStore.findIndex(v => v.key === key);
    return index !== -1;
}

const hasValue = (value: any): boolean => {
    let index = coreValueStore.findIndex(v => v.value === value);
    return index !== -1;
};

const registry: CoreValueStore = {
    add,
    getById,
    getByKey,
    getAllValues,
    getAllStoreValues,
    hasKey,
    hasValue,
};

export default registry;
