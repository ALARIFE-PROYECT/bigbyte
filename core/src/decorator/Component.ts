/**
 * * Decorador
 * 
 * Para registrar una clase como un Componente en el contenedor de dependencias.
 */

import "reflect-metadata";

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";
import { declareDecorator, decoratorExecEvent, executeDecorator } from "@bigbyte/events";
import { ComponentOptions, componentRegistry, ComponentType } from "@bigbyte/ioc";
import { checkUniqueDecorator } from "@bigbyte/utils/utilities";

import { DECORATOR_COMPONENT_NAME, DECORATOR_SERVICE_NAME, LIBRARY_NAME } from "../constant";

type ReduceComponentOptions = Omit<ComponentOptions, "type">;

const log = new Logger(LIBRARY_NAME);

export const Component = (options: ReduceComponentOptions = {}): ClassDecorator => {
    declareDecorator(DECORATOR_COMPONENT_NAME);

    return (Target: Function): void => {
        log.dev(`${DECORATOR_COMPONENT_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.COMPONENT;
        
        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_SERVICE_NAME}`, true, Target);

        decoratorExecEvent.on('last', () => {
            // Valida que la clase no tenga mas de un decorador
            checkUniqueDecorator(Target);

            const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
            componentRegistry.add(Target, paramTypes, {
                ...options,
                type: componentType 
            });
        });

        executeDecorator(DECORATOR_COMPONENT_NAME);
    }
}