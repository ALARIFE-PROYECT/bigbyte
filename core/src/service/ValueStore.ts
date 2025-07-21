

// igual que el Inyecctor para el registry de components, pero para el registry de values

import { ComponentType, CoreValueStore } from "@bigbyte/utils/registry";

import coreComponentRegistry from "../container/CoreComponentRegistry";
import CoreValueRegistry from "../container/coreValueStore";

class Store {
    private store: CoreValueStore;

    constructor() {
        this.store = CoreValueRegistry;
    }

    // get<T>(service: new (...args: any[]) => T, ...args: any[]): T {
    //     return this.registry.get(service, ...args);
    // }

    // add<T>(service: new (...args: any[]) => T, ...args: any[]): void {
    //     this.registry.add(service, ...args);
    // }
}

coreComponentRegistry.add(Store, [], { type: ComponentType.COMPONENT, injectable: true });
