/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de componentes programaticamente.
 */

import { Component, ComponentType } from "@bigbyte/utils/registry";

import registry from "../container/CoreComponentRegistry";

export class Injector {
    add(Target: Function): void {
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target);
        registry.add(Target, paramTypes, {
            type: ComponentType.COMPONENT,
            injectable: true
        });
    }

    get(Target: Function): Component | undefined {
        return registry.getByClass(Target, false);
    }

    has(value: any): boolean {
        return registry.has(value);
    }
}
