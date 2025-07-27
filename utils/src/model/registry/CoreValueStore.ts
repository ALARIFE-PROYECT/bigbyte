import { StoreValue } from "./StoreValue";

export interface CoreValueStore {
    add: (key: string, value: string | undefined) => void;
    getByKey: (key: string) => StoreValue | undefined;
    getById: (id: string) => StoreValue | undefined;
    getAllStoreValues: () => StoreValue[];
    getAllValues: () => Map<string, string | undefined>;
    hasKey: (key: string) => boolean;
    hasValue: (value: any) => boolean;
}
