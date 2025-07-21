import { StoreValue, StoreValueType, CoreValueStore } from '@bigbyte/utils/registry';

/**
 * CoreValueRegistry es un contenedor de inyeccion de valores que se utiliza para almacenar los valores del core y sus addons.
 */
export const coreValueStore: StoreValue[] = new Array<StoreValue>();

export const setEnvironmentsInStore = (): void => {
    Object.keys(process.env).forEach((key: string) => {
        const value = process.env[key];
        if (value) {
            const instanceValue = new StoreValue(value, key, { type: StoreValueType.ENVIRONMENT });
            coreValueStore.push(instanceValue);
        }
    });
}

const add = (value: any, type?: StoreValueType | string): void => {
    const instanceValue = new StoreValue(value, type);
    coreValueStore.push(instanceValue);
};

const getByKey = (key: string): StoreValue | undefined => {
    return coreValueStore.find(v => v.key === key);
}

const getById = (id: string): StoreValue | undefined => {
    return coreValueStore.find(v => v.id === id);
}

const getByType = (type: StoreValueType | string): StoreValue[] => {
    return coreValueStore.filter(v => v.type === type);
}

const has = (value: any): boolean => {
    let index = coreValueStore.findIndex(v => v.id === value || v.value === value);
    return index !== -1;
};


export default {
    add,
    getById,
    getByType,
    getByKey,
    has,
} as CoreValueStore;
