/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/ioc.
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

import { v4 } from 'uuid';
import { NonInjectableComponentError } from '../exception/NonInjectableComponentError';

export enum ComponentType {
    MAIN = 'MAIN',
    COMPONENT = 'COMPONENT',
    SERVICE = 'SERVICE',
    REPOSITORY = 'REPOSITORY',
    CONTROLLER = 'CONTROLLER',
}

/**
 * Solo los Beans son inyectables (Servicios, Repositorios, Controladores)
 * 
 * TODO: Posibles mejoras:
 * - Decorador @Lazy
 * - Decorador @Primary
 */

export interface ComponentOptions {
    injectable?: boolean;
    type?: ComponentType;
}

const defaultComponentOptions: ComponentOptions = {
    injectable: true,
    type: ComponentType.COMPONENT
}

export class Component {

    #id: string;

    #class: any;

    #instance: any;

    #options: ComponentOptions;

    #createAt: Date = new Date();

    constructor(Target: any, dependencies: Component[], options: ComponentOptions = {}) {
        this.#id = v4();
        this.#class = Target;
        this.#options = { ...defaultComponentOptions, ...options  };

        const dependenciesInstances = dependencies.map(c => {
            if (!c.options.injectable) {
                throw new NonInjectableComponentError(c.name);
            } else {
                return c.instance;
            }
        });

        this.#instance = new Target(...dependenciesInstances);
    }

    get id(): string {
        return this.#id;
    }

    get name(): string {
        return this.#class.name;
    }

    get class(): any {
        return this.#class;
    }

    get instance(): any {
        return this.#instance;
    }

    get options(): ComponentOptions {
        return this.#options;
    }

    get createAt(): Date {
        return this.#createAt;
    }
}