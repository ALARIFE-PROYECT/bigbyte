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
 * Decorador para inyectar servicios
 * 
 * usado como decorador de parametro de clase 
 */
import 'reflect-metadata';
import { DecoratorError } from '@bigbyte/utils/exception';
import { componentRegistry } from "@bigbyte/ioc";


export const Inject = (): PropertyDecorator => {
    return (Target: any, propertyKey: string | symbol): void => {
        if(propertyKey.toString().startsWith('#')) {
            throw new DecoratorError(`The property "${propertyKey.toString()}" is private and cannot be decorated with @Value.`);
        }

        const componentType = Reflect.getMetadata('design:type', Target, propertyKey);
        const component = componentRegistry.getByClass(componentType, false);

        if(!component) {
            throw new DecoratorError(`No component found for type "${componentType.name}" to inject into property "${String(propertyKey)}".`);
        }

        Object.defineProperty(Target, propertyKey, {
            get() {
                return component.instance;
            },
            enumerable: true,
            configurable: true
        });
    }
}
