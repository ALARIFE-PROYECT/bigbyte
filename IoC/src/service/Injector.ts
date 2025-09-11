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

/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de componentes programaticamente.
 */

import "reflect-metadata";

import { componentRegistry } from "../container/ComponentRegistry";
import { Component, ComponentType } from "../model/Component";

export class Injector {
    add(Target: Function): void {
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target);
        componentRegistry.add(Target, paramTypes, {
            type: ComponentType.COMPONENT,
            injectable: true
        });
    }

    get(Target: Function): Component | undefined {
        return componentRegistry.getByClass(Target, false);
    }

    has(value: any): boolean {
        return componentRegistry.has(value);
    }
}

componentRegistry.add(Injector, [], { type: ComponentType.COMPONENT, injectable: true });
