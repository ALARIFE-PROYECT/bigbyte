import { v4 } from 'uuid';
import { NonInjectableComponentError } from '../exception/NonInjectableComponentError';

export enum ComponentType {
    MAIN = 'MAIN',
    COMPONENT = 'COMPONENT',
    SERVICE = 'SERVICE',
    REPOSITORY = 'REPOSITORY',
    CONTROLLER = 'CONTROLLER',
}

/**
 * Solo los Beans son inyectables (Servicios, Repositorios, Controladores)
 * 
 * TODO: Posibles mejoras:
 * - Decorador @Lazy
 * - Decorador @Primary
 */

export interface ComponentOptions {
    injectable?: boolean;
    type?: ComponentType;
}

const defaultComponentOptions: ComponentOptions = {
    injectable: true,
    type: ComponentType.COMPONENT
}

export class Component {

    #id: string;

    #class: any;

    #instance: any;

    #options: ComponentOptions;

    #createAt: Date = new Date();

    constructor(Target: any, dependencies: Component[], options: ComponentOptions = {}) {
        this.#id = v4();
        this.#class = Target;
        this.#options = { ...defaultComponentOptions, ...options  };

        const dependenciesInstances = dependencies.map(c => {
            if (!c.options.injectable) {
                throw new NonInjectableComponentError(c.name);
            } else {
                return c.instance;
            }
        });

        this.#instance = new Target(...dependenciesInstances);
    }

    get id(): string {
        return this.#id;
    }

    get name(): string {
        return this.#class.name;
    }

    get class(): any {
        return this.#class;
    }

    get instance(): any {
        return this.#instance;
    }

    get options(): ComponentOptions {
        return this.#options;
    }

    get createAt(): Date {
        return this.#createAt;
    }
}