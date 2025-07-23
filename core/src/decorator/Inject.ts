
/**
 * Decorador para inyectar servicios
 * 
 * usado como decorador de parametro de clase 
 */

export const Inject = (): ParameterDecorator => {

    return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number): void => {
        console.log("🚀 ~ parameterIndex:", parameterIndex)
        console.log("🚀 ~ propertyKey:", propertyKey)
        console.log("🚀 ~ target:", target)

    }
}
