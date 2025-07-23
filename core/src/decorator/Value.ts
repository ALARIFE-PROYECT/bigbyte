/**
 * * Decorador
 * 
 * Decora una propiedad de una clase para inyectar un valor.
 * * Los valores inyectados no son modificables.
 */
import coreValueRegistry from "../container/coreValueStore";

export const Value = (key: string): PropertyDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        const storeVale = coreValueRegistry.getByKey(key);
            console.log("🚀 ~ return ~ storeVale?.value:", storeVale?.value)
        
        Object.defineProperty(target, propertyKey, {
            value: storeVale?.value,
            writable: false,
            configurable: false,
        });
    }
}
