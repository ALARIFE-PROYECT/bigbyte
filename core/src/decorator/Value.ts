/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/core.
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

/**
 * * Decorador
 * 
 * Decora una propiedad de una clase para inyectar un valor.
 * * Los valores inyectados no son modificables.
 * * No se puede aplicar a propiedades privadas de ECMAScript (que comienzan con `#`).
 * 
 */
import { DecoratorError } from '@bigbyte/utils/exception';
import { ctxStore } from '@bigbyte/ctx';


export const Value = (key: string): PropertyDecorator => {
    return (Target: any, propertyKey: string | symbol): void =>  {
        if(propertyKey.toString().startsWith('#')) {
            throw new DecoratorError(`The property "${propertyKey.toString()}" is private and cannot be decorated with @Value.`);
        }

        Object.defineProperty(Target, propertyKey, {
            get() {
                const storeVale = ctxStore.getByKey(key);
                return storeVale?.value;
            },
            enumerable: true,
            configurable: true
        });
    };
}
