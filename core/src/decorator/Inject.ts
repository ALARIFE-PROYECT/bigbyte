
/**
 * Decorador para inyectar servicios
 * 
 * usado como decorador de parametro de clase 
 */
import 'reflect-metadata';
import { DecoratorError } from '@bigbyte/events';
import { componentRegistry } from "@bigbyte/ioc";


export const Inject = (): PropertyDecorator => {
    return (Target: any, propertyKey: string | symbol): void => {
        if(propertyKey.toString().startsWith('#')) {
            throw new DecoratorError(`The property "${propertyKey.toString()}" is private and cannot be decorated with @Value.`);
        }

        const componentType = Reflect.getMetadata('design:type', Target, propertyKey);
        const component = componentRegistry.getByClass(componentType, false);

        if(!component) {
            throw new DecoratorError(`No component found for type "${componentType.name}" to inject into property "${String(propertyKey)}".`);
        }

        Object.defineProperty(Target, propertyKey, {
            get() {
                return component.instance;
            },
            enumerable: true,
            configurable: true
        });
    }
}
