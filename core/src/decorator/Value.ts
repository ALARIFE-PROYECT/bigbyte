/**
 * * Decorador
 * 
 * Decora una propiedad de una clase para inyectar un valor.
 * * Los valores inyectados no son modificables.
 * * No se puede aplicar a propiedades privadas de ECMAScript (que comienzan con `#`).
 * 
 */
import { DecoratorError } from "@bigbyte/utils";
import coreValueRegistry from "../container/CoreValueStore";

export const Value = (key: string): PropertyDecorator => {
    return function (Target: any, propertyKey: string | symbol): void {
        if(propertyKey.toString().startsWith('#')) {
            throw new DecoratorError(`The property "${propertyKey.toString()}" is private and cannot be decorated with @Value.`);
        }

        Object.defineProperty(Target, propertyKey, {
            get() {
                const storeVale = coreValueRegistry.getByKey(key);
                return storeVale?.value;
            },
            enumerable: true,
            configurable: true
        });
    };
}
