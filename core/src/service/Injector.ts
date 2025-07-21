/**
 * Es un servicio que se guardara en el CoreRegistry directamente para inyectarlo en los servicios del user y usarlo
 * 
 */


// ejemplo
// constructor(injector: Injector) {
//     this.#injector = injector;
// }

// hello(): void {
//     this.userService = this.#injector.get(UserService, null);
// }


import { ComponentType, CoreComponentRegistry } from "@bigbyte/utils/registry";

import registry from "../container/CoreComponentRegistry";

export class Injector {
    private registry: CoreComponentRegistry;

    constructor() {
        this.registry = registry;
    }

    // get<T>(service: new (...args: any[]) => T, ...args: any[]): T {
    //     return this.registry.get(service, ...args);
    // }

    // add<T>(service: new (...args: any[]) => T, ...args: any[]): void {
    //     this.registry.add(service, ...args);
    // }
}

registry.add(Injector, [], { type: ComponentType.COMPONENT, injectable: true });
