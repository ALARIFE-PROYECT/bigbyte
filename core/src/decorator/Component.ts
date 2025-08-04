/**
 * * Decorador
 * 
 * Para registrar una clase como un Componente en el contenedor de dependencias.
 */

import "reflect-metadata";

import { METADATA_COMPONENT_TYPE, METADATA_DECORATOR_NAME } from "@bigbyte/utils/constant";
import Logger from "@bigbyte/utils/logger";
import { declareDecorator, executeDecorator } from "@bigbyte/utils/decorator";
import { ComponentType } from "@bigbyte/utils/registry";

import coreComponentRegistry from '../container/CoreComponentRegistry';
import { DECORATOR_COMPONENT_NAME, DECORATOR_SERVICE_NAME, LIBRARY_NAME } from "../constant";


const log = new Logger(LIBRARY_NAME);

export const Component = (): ClassDecorator => {
    declareDecorator(DECORATOR_COMPONENT_NAME);

    return (Target: Function): void => {
        executeDecorator(DECORATOR_COMPONENT_NAME);
        log.dev(`${DECORATOR_COMPONENT_NAME} decorator applied to ${Target.name}`);

        const componentType = ComponentType.COMPONENT;
        Reflect.defineMetadata(METADATA_COMPONENT_TYPE, componentType, Target);
        Reflect.defineMetadata(`${METADATA_DECORATOR_NAME}=${DECORATOR_SERVICE_NAME}`, true, Target);

        const paramTypes = Reflect.getMetadata("design:paramtypes", Target) ?? [];
        coreComponentRegistry.add(Target, paramTypes, { type: componentType });
    }
}