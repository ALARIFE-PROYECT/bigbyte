import { Component, ComponentOptions, ComponentType, CoreComponentRegistry } from '@bigbyte/utils/registry';
import { MissingDependencyError } from '../exception/MissingDependencyError';

/**
 * CoreComponentRegistry es un contenedor de inyeccion de dependencias que se utiliza para almacenar los servicios del core y sus addons.
 */
export const coreComponentRegistry: Component[] = new Array<Component>();

const add = (Target: Function, dependenciesClass: Function[], options?: ComponentOptions): void => {
    const dependencies = getAllByClass(dependenciesClass);
    const component = new Component(Target, dependencies, options);

    coreComponentRegistry.push(component);
};

const getByClass = (Target: Function, strict: boolean = true): Component | undefined => {
    const injectable = coreComponentRegistry.find(injectable => injectable.class === Target);

    if (!injectable && strict === true) {
        throw new MissingDependencyError(Target);
    }

    return injectable;
};

const getById = (id: string): Component => {
    const injectable = coreComponentRegistry.find(injectable => injectable.id === id);

    if (!injectable) {
        throw new MissingDependencyError(id);
    }

    return injectable;
}

const getAllByClass = (items: Function[] = []): Array<Component> => {
    const result: Array<Component> = new Array();

    items.forEach((target: Function) => {
        // siempre existe por strict proboca la excepcion
        result.push(getByClass(target)!);
    });

    return result;
}

/**
 * Comprueba si el valor existe en el coreRegistry por id o por clase.
 * 
 * @param value - El valor a comprobar. Puede ser una clase o un id.
 * @returns 
 */
const has = (value: any): boolean => {
    let index = coreComponentRegistry.findIndex(injectable => injectable.class === value || injectable.id === value);
    return index !== -1;
};

const registry = {
    add,
    getByClass,
    getById,
    has,
} as CoreComponentRegistry;

export default registry;
