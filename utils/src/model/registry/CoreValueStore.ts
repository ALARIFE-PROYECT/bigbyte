import { StoreValue, StoreValueType } from "./StoreValue";

export interface CoreValueStore {
    add: (value: any, type?: StoreValueType | string) => void;
    getByType: (type: StoreValueType | string) => StoreValue[];
    getById: (id: string) => StoreValue | undefined;
    getByKey: (key: string) => StoreValue | undefined;
    has: (value: any) => boolean;
}
