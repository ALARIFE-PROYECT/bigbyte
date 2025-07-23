import { v4 } from "uuid";
import { NativeType } from "../NativeType";


export class StoreValue {
    #id: string;

    #key: string;

    #value: NativeType;

    #createAt: Date = new Date();

    constructor(key: string, value: NativeType) {
        this.#id = v4();
        this.#key = key;
        this.#value = value;
    }

    get id(): string {
        return this.#id;
    }

    get key(): string {
        return this.#key;
    }

    get value(): string | boolean | number | undefined {
        return this.#value;
    }

    get createAt(): Date {
        return this.#createAt;
    }
}
