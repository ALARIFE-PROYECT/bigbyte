import { v4 } from 'uuid';
import { NonInjectableComponentError } from '../../exception/NonInjectableComponentError';

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
    recreate?: boolean;

    // clase decorada, invocadora de la inyeccion del componente
    invoker?: Function;
}

const defaultComponentOptions: ComponentOptions = {
    injectable: true,
    type: ComponentType.COMPONENT,
    recreate: false,
}

export class Component {

    #id: string;

    #class: any;

    #dependencies: Component[]; // ! posible fuga de memoria

    #instance: any;

    #options: ComponentOptions;

    #createAt: Date = new Date();

    constructor(Target: any, dependencies: Component[], options: ComponentOptions = defaultComponentOptions) {
        this.#id = v4();
        this.#class = Target;
        this.#dependencies = dependencies ?? [];
        this.#options = { ...options, ...defaultComponentOptions };

        const dependenciesIntances = dependencies.map(c => {
            if (!c.options.injectable) {
                throw new NonInjectableComponentError(c.name);
            } else if (c.options.recreate) {
                return new c.class(Target, ...c.dependencies.map(d => d.instance));
            } else {
                return c.instance;
            }
        });

        this.#instance = new Target(...dependenciesIntances);

        if (options.invoker) {
            this.#instance.invoker = options.invoker;
        }
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

    get dependencies(): Component[] {
        return this.#dependencies;
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