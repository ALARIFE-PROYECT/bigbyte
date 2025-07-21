import { Component, ComponentOptions } from "./Component";

export interface CoreComponentRegistry {
    add: (Target: Function, dependenciesClass: Function[], options?: ComponentOptions) => void;
    getByClass: (Target: Function) => Component;
    getById: (id: string) => Component;
    has: (value: any) => boolean;
}
