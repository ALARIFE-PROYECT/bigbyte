/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/ctx.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

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
