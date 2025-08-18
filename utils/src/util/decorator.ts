import "reflect-metadata";
import { METADATA_DECORATOR_NAME } from "../constant";
import { DecoratorError, OrderDecoratorsError } from "../exception";


export const getDecorators = (metadataKeys: Array<string>): Array<string> => {
    return metadataKeys
        .filter(e => e.includes(METADATA_DECORATOR_NAME))
        .map(e => e.split('=')[1]);
}

export const checkFirstDecorator = (Target: Function): void => {
    const keys = Reflect.getMetadataKeys(Target);
    const decorators = getDecorators(keys);
    if (decorators.length > 0) {
        throw new OrderDecoratorsError(decorators);
    }
}

export const checkDecoratorExists = (Target: Function, targetDecoratorName: string): boolean => {
    const keys = Reflect.getMetadataKeys(Target);
    const decorators: Array<string> = getDecorators(keys);
    return decorators.includes(targetDecoratorName);
}

export const checkUniqueDecorator = (Target: Function): void => {
    const metadataKeys = Reflect.getMetadataKeys(Target);
    const decorators = metadataKeys.filter(e => e.includes(METADATA_DECORATOR_NAME)).map(e => e.split('=')[1]);

    if (decorators.length > 1) {
        throw new DecoratorError(`Class ${Target.name} is decorated with ${decorators.join(', ')} and @Controller() does not allow it.`);
    }
}
