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
