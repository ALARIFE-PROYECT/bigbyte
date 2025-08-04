import { MissingDependencyError } from "../exception/MissingDependencyError";
import { Component, ComponentOptions } from "../model/Component";

/**
 * Clase que gestiona el registro de componentes.
 */
class ComponentRegistry {
    registry: Array<Component>;

    constructor() {
        this.registry = [];
    }

    /**
     * Recupera todos los componentes del registry por clase.
     * 
     * @param items - Las clases de los componentes a buscar.
     * @returns 
     */
    private getAllByClass(items: Function[] = []): Array<Component> {
        const result: Array<Component> = new Array();

        items.forEach((target: Function) => {
            // siempre existe, por que si no strict proboca la excepcion.
            result.push(this.getByClass(target)!);
        });

        return result;
    }

    /**
     * Añade un componente al registry.
     * 
     * @param Target - La clase del componente a añadir.
     * @param dependencies - Las dependencias del componente.
     * @param options - Opciones del componente.
     * @returns 
     */
    add(Target: Function, dependencies: Function[], options?: ComponentOptions): string {
        const dependentComponents = this.getAllByClass(dependencies);
        const component = new Component(Target, dependentComponents, options);

        this.registry.push(component);

        return component.id;
    }

    /**
     * Rescata el componente por la clase.
     * 
     * @param Target - La clase del componente a buscar.
     * @param strict - Si es true, lanza una excepción si no se encuentra el componente.
     * @returns 
     */
    getByClass(Target: Function, strict: boolean = true): Component | undefined {
        const injectable = this.registry.find(c => c.class === Target);

        if (!injectable && strict === true) {
            throw new MissingDependencyError(Target);
        }

        return injectable;
    }

    /**
     * Rescata el componente por el id.
     * 
     * @param id - El id del componente a buscar.
     * @returns 
     */
    getById(id: string): Component {
        const injectable = this.registry.find(c => c.id === id);

        if (!injectable) {
            throw new MissingDependencyError(id);
        }

        return injectable;
    }

    /**
     * Comprueba si el componente existe en el registry por id o por clase.
     * 
     * @param value - El valor a comprobar. Puede ser una clase o un id.
     * @returns 
     */
    has(value: any): boolean {
        const index = this.registry.findIndex(c => c.class === value || c.id === value);
        return index !== -1;
    }
}

export const componentRegistry = new ComponentRegistry();
