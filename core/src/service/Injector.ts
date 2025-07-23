/**
 * * Servicio
 * 
 * Servicio que permite usar el registry de componentes programaticamente.
 */

import { Component, ComponentType, CoreComponentRegistry } from "@bigbyte/utils/registry";

import registry from "../container/CoreComponentRegistry";

export class Injector {
    private registry: CoreComponentRegistry;

    constructor() {
        this.registry = registry;
    }

    // add(component: Component): void {
    //     this.registry.add(component);
    // }

    // get<T> (target: Function): Component {
    //     return this.registry.getByClass(target) as Component;
    // }

    // has() {

    // }
}

registry.add(Injector, [], { type: ComponentType.COMPONENT, injectable: true });
