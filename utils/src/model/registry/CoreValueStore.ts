import { NativeType } from "../NativeType";
import { StoreValue } from "./StoreValue";

export interface CoreValueStore {
    add: (key: string, value: NativeType) => void;
    getByKey: (key: string) => StoreValue | undefined;
    getById: (id: string) => StoreValue | undefined;
    getAllStoreValues: () => StoreValue[];
    getAllValues: () => Map<string, NativeType>;
    hasKey: (key: string) => boolean;
    hasValue: (value: any) => boolean;
}
