import { v4 } from "uuid";


export class StoreValue {
    #id: string;

    #key: string;

    #value?: string;

    #createAt: Date = new Date();

    constructor(key: string, value?: string) {
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
