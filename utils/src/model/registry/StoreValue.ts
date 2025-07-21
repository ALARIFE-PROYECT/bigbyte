import { v4 as uuidv4 } from 'uuid';

export enum StoreValueType {
    ENVIRONMENT = 'ENVIRONMENT',
}

export interface StoreValueOptions {
    type?: StoreValueType | string;
}

export class StoreValue {
    #id: string;

    #key?: string;

    #value: any;

    #type?: StoreValueType | string;

    #createAt: Date = new Date();

    constructor(value: any, key?: string, options: StoreValueOptions = {}) {
        this.#id = uuidv4();
        this.#key = key;
        this.#value = value;
        
        this.#type = options.type;
    }

    get id(): string {
        return this.#id;
    }

    get key(): string | undefined {
        return this.#key;
    }

    get value(): any {
        return this.#value;
    }

    get type(): StoreValueType | string | undefined {
        return this.#type;
    }

    get createAt(): Date {
        return this.#createAt;
    }
}
