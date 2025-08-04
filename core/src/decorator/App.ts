/**
 * * Decorador
 * 
 * Decora la clase principal para iniciar el proceso
 */

import "reflect-metadata";

import { METADATA_CORE_COMPONENT_REGISTRY, METADATA_CORE_VALUE_REGISTRY, METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import { ComponentType } from "@bigbyte/utils/registry";
import { declareDecorator, decoratorExecEvent, executeDecorator, getDecorators } from "@bigbyte/utils/decorator";
import Logger from "@bigbyte/utils/logger";

import coreComponentRegistry from '../container/CoreComponentRegistry';
import coreValueRegistry from "../container/CoreValueStore";
import { DECORATOR_APP_NAME, LIBRARY_NAME } from "../constant";

import { OrderDecoratorsError } from "../exception/OrderDecoratorsError";
import { Injector } from "../injector";
import { ValueStore } from "../store";


const log = new Logger(LIBRARY_NAME);

export const App = (): ClassDecorator => {
    declareDecorator(DECORATOR_APP_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_APP_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.MAIN;

        // Valido que el decorador @App() es el primero que se aplica a la clase
        const keys = Reflect.getMetadataKeys(Target);
        const decorators = getDecorators(keys);    
        if (decorators.length > 0) {
            throw new OrderDecoratorsError(decorators);
        }

        // Definicion d emetadatos
        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_APP_NAME}`, true, Target);

        Reflect.defineMetadata(METADATA_CORE_COMPONENT_REGISTRY, coreComponentRegistry, Target);
        Reflect.defineMetadata(METADATA_CORE_VALUE_REGISTRY, coreValueRegistry, Target);

        // Registro de servicios
        coreComponentRegistry.add(Injector, [], { type: ComponentType.COMPONENT, injectable: true });
        coreComponentRegistry.add(ValueStore, [], { type: ComponentType.COMPONENT, injectable: true });

        // Registro de evento
        decoratorExecEvent.on('last', () => {
            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            coreComponentRegistry.add(Target, paramTypes, { type: componentType, injectable: false });
        });

        executeDecorator(DECORATOR_APP_NAME);
    }
}
