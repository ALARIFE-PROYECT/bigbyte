/**
 * * Decorador
 * 
 * Decora una propiedad de una clase para inyectar un valor.
 * * Los valores inyectados no son modificables.
 */
import coreValueRegistry from "../container/CoreValueStore";

export const Value = (key: string): PropertyDecorator => {
    return function (target: any, propertyKey: string | symbol) {
        // const privateKey = Symbol(); // Clave privada para almacenar el valor

        Object.defineProperty(target, propertyKey, {
            get: function () {
                const storeVale = coreValueRegistry.getByKey(key);
                // console.log("🚀 ~ Value ~ storeVale:", storeVale)
                return storeVale?.value;
            },
            // set: function (newValue: any) {
            //     this[privateKey] = newValue;
            // },
            enumerable: true,
            configurable: true,
        });

        // console.log("🚀 ~ Value ~ target:", target)

    };
    // return (target: Object, propertyKey: string | symbol) => {
    //     // const storeVale = coreValueRegistry.getByKey(key);

    //     // Object.defineProperty(target, propertyKey, {
    //     //     value: storeVale?.value
    //     // });

    //     const privateKey = Symbol(); // Clave privada para almacenar el valor

    //     Object.defineProperty(target, propertyKey, {
    //         get: function () {
    //             const storeVale = coreValueRegistry.getByKey(key);
    //             console.log("🚀 ~ Value ~ storeVale:", storeVale)
    //             return storeVale?.value;
    //         },
    //         // set: function (newValue: any) {
    //         //     this[privateKey] = newValue;
    //         // },
    //         enumerable: true,
    //         configurable: true,
    //     });
    // }
}
