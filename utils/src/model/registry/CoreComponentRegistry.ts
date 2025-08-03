import { Component, ComponentOptions } from "./Component";

export interface CoreComponentRegistry {
    /**
     * Añade el componente al registry
     * @return Id del componente
     */
    add: (Target: Function, dependenciesClass: Function[], options?: ComponentOptions) => string;
    getByClass: (Target: Function, strict?: boolean) => Component | undefined;
    getById: (id: string) => Component;
    has: (value: any) => boolean;
}
