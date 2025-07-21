/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el proceso
 */

import "reflect-metadata";

import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_CORE_VALUE_REGISTRY, METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType, declareDecorator, decoratorExecEvent, executeDecorator } from "@bigbyte/utils/registry";
import Logger from "@bigbyte/utils/logger";

import coreComponentRegistry from '../container/CoreComponentRegistry';
import coreValueRegistry, { setEnvironmentsInStore } from "../container/coreValueStore";
import { DECORATOR_APP_NAME, LIBRARY_NAME } from "../constant";

import { OrderDecoratorsError } from "../exception/OrderDecoratorsError";

const log = new Logger(DECORATOR_APP_NAME, LIBRARY_NAME);


export const App = (): ClassDecorator => {
    declareDecorator(DECORATOR_APP_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_APP_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.MAIN;

        // Valido que el decorador @App() es el primero que se aplica a la clase
        const keys = Reflect.getMetadataKeys(Target);
        const decorators = keys.filter(e => e.includes(METADATA_DECORATOR_NAME)).map(e => e.split('=')[1]);
        if (decorators.length > 0) {
            throw new OrderDecoratorsError(decorators);
        }

        setEnvironmentsInStore();

        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_APP_NAME}`, true, Target);

        Reflect.defineMetadata(METADATA_CORE_COMPONENT_REGISTRY, coreComponentRegistry, Target);
        Reflect.defineMetadata(METADATA_CORE_VALUE_REGISTRY, coreValueRegistry, Target);

        decoratorExecEvent.on('last', () => {
            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            coreComponentRegistry.add(Target, paramTypes, { type: componentType, injectable: false });
        });

        executeDecorator(DECORATOR_APP_NAME);
    }
}